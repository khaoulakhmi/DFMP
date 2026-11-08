/**
 * Integration tests for list endpoints, pagination and the dashboard summary.
 *
 * Read-only: the database is only queried to get expected values, and
 * requests use short-lived access tokens signed with ACCESS_TOKEN_SECRET.
 *
 * Run against a running API (Docker or local):
 *   API_URL=http://localhost:4000/api npm run test:pagination
 * Loads backend/.env and prefers DATABASE_URL_HOST over DATABASE_URL.
 */
import "dotenv/config";
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const API_URL = (process.env.API_URL ?? "http://localhost:4000/api").replace(/\/+$/, "");
const connectionString = process.env.DATABASE_URL_HOST || process.env.DATABASE_URL;
const secret = process.env.ACCESS_TOKEN_SECRET;

if (!connectionString) throw new Error("Set DATABASE_URL_HOST or DATABASE_URL");
if (!secret) throw new Error("Set ACCESS_TOKEN_SECRET");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

type Pagination = { page: number; pageSize: number; total: number; totalPages: number };
type ListBody = { data: Array<Record<string, unknown> & { id: string | number }>; pagination: Pagination };

let adminToken = "";

const tokenFor = (userId: string) =>
    jwt.sign({ userId }, secret, { algorithm: "HS256", expiresIn: "5m" });

const get = async (path: string, token: string | null = adminToken) => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "X-CSRF-Protection": "1",
            ...(token ? { Cookie: `accessToken=${token}` } : {}),
        },
    });
    const body: unknown = response.status === 204 ? null : await response.json();
    return { status: response.status, body };
};

const getList = async (path: string): Promise<ListBody> => {
    const { status, body } = await get(path);
    assert.equal(status, 200, `${path} -> ${status} ${JSON.stringify(body)}`);
    assertListShape(body);
    return body;
};

function assertListShape(body: unknown): asserts body is ListBody {
    assert.ok(body && typeof body === "object", "body is an object");
    const { data, pagination } = body as ListBody;
    assert.ok(Array.isArray(data), "data is an array");
    assert.ok(pagination && typeof pagination === "object", "pagination exists");
    for (const key of ["page", "pageSize", "total", "totalPages"] as const) {
        assert.equal(typeof pagination[key], "number", `pagination.${key} is a number`);
    }
    assert.equal(pagination.totalPages, Math.ceil(pagination.total / pagination.pageSize));
}

// Walks every page and returns ids in order.
const collectAllIds = async (path: string, pageSize: number) => {
    const separator = path.includes("?") ? "&" : "?";
    const first = await getList(`${path}${separator}page=1&pageSize=${pageSize}`);
    const ids = first.data.map(row => row.id);
    for (let page = 2; page <= first.pagination.totalPages; page++) {
        const next = await getList(`${path}${separator}page=${page}&pageSize=${pageSize}`);
        assert.equal(next.pagination.total, first.pagination.total, "total is stable across pages");
        ids.push(...next.data.map(row => row.id));
    }
    return { ids, total: first.pagination.total };
};

const endpoints = [
    { path: "/users", count: () => prisma.user.count() },
    { path: "/providers", count: () => prisma.provider.count() },
    { path: "/designations", count: () => prisma.designation.count() },
    { path: "/lots", count: () => prisma.lot.count() },
    { path: "/products", count: () => prisma.product.count() },
    { path: "/specifications", count: () => prisma.specifications.count() },
];

before(async () => {
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN", status: true },
        select: { id: true },
    });
    assert.ok(admin, "an active ADMIN user must exist");
    adminToken = tokenFor(admin.id);
});

after(async () => {
    await prisma.$disconnect();
});

describe("list endpoints", () => {
    for (const endpoint of endpoints) {
        describe(endpoint.path, () => {
            test("returns { data, pagination } with the real total", async () => {
                const body = await getList(`${endpoint.path}?pageSize=5`);
                assert.equal(body.pagination.total, await endpoint.count());
                assert.equal(body.pagination.page, 1);
                assert.equal(body.pagination.pageSize, 5);
                assert.ok(body.data.length <= 5);
            });

            test("pages do not overlap and cover every record", async () => {
                const { ids, total } = await collectAllIds(endpoint.path, 7);
                assert.equal(ids.length, total, "every record appears once");
                assert.equal(new Set(ids).size, ids.length, "no id repeats across pages");
            });

            test("a page past the end is empty but keeps the total", async () => {
                const body = await getList(`${endpoint.path}?page=9999&pageSize=10`);
                assert.deepEqual(body.data, []);
                assert.equal(body.pagination.total, await endpoint.count());
            });

            test("a search with no match returns a consistent empty response", async () => {
                const body = await getList(`${endpoint.path}?search=zz-no-match-zz-9431`);
                assert.deepEqual(body.data, []);
                assert.deepEqual(body.pagination, { page: 1, pageSize: 20, total: 0, totalPages: 0 });
            });

            const invalid = [
                "page=0",
                "page=-1",
                "page=abc",
                "pageSize=0",
                "pageSize=101",
                "sortBy=password",
                "sortOrder=sideways",
                "unknownParam=1",
                "page=1&page=2",
                `search=${"x".repeat(101)}`,
            ];
            for (const query of invalid) {
                test(`rejects ?${query.slice(0, 30)} with 400`, async () => {
                    const { status } = await get(`${endpoint.path}?${query}`);
                    assert.equal(status, 400);
                });
            }

            test("requires authentication", async () => {
                const { status } = await get(endpoint.path, null);
                assert.equal(status, 401);
            });
        });
    }
});

describe("sorting is global, not per page", () => {
    test("products by name asc match the database order across pages", async () => {
        const { ids } = await collectAllIds("/products?sortBy=name&sortOrder=asc", 9);
        const expected = await prisma.product.findMany({
            orderBy: [{ name: "asc" }, { id: "asc" }],
            select: { id: true },
        });
        assert.deepEqual(ids, expected.map(row => row.id));
    });

    test("providers by company desc match the database order across pages", async () => {
        const { ids } = await collectAllIds("/providers?sortBy=company&sortOrder=desc", 8);
        const expected = await prisma.provider.findMany({
            orderBy: [{ company: "desc" }, { id: "asc" }],
            select: { id: true },
        });
        assert.deepEqual(ids, expected.map(row => row.id));
    });

    test("users default to newest first", async () => {
        const body = await getList("/users?pageSize=100");
        const expected = await prisma.user.findMany({
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
            select: { id: true },
        });
        assert.deepEqual(body.data.map(row => row.id), expected.map(row => row.id));
    });
});

describe("search and filter totals match their results", () => {
    test("product search", async () => {
        const sample = await prisma.product.findFirst({ select: { name: true } });
        if (!sample) return;
        const term = sample.name.slice(0, Math.min(4, sample.name.length));
        const { ids, total } = await collectAllIds(`/products?search=${encodeURIComponent(term)}`, 10);
        const expected = await prisma.product.count({
            where: {
                OR: [
                    { name: { contains: term, mode: "insensitive" } },
                    { unit: { contains: term, mode: "insensitive" } },
                ],
            },
        });
        assert.equal(total, expected);
        assert.equal(ids.length, expected);
    });

    test("lots with and without a specification add up", async () => {
        const all = await getList("/lots?pageSize=1");
        const withSpec = await getList("/lots?hasSpecification=true&pageSize=100");
        const withoutSpec = await getList("/lots?hasSpecification=false&pageSize=100");
        assert.equal(withSpec.pagination.total + withoutSpec.pagination.total, all.pagination.total);
        assert.ok(withSpec.data.every(lot => lot.specificationsId !== null));
        assert.ok(withoutSpec.data.every(lot => lot.specificationsId === null));
        assert.equal(
            withSpec.pagination.total,
            await prisma.lot.count({ where: { specificationsId: { not: null } } }),
        );
    });

    test("products not in a lot exclude that lot only", async () => {
        const lot = await prisma.lot.findFirst({
            where: { products: { some: {} } },
            select: { id: true },
        });
        if (!lot) return;
        const { ids, total } = await collectAllIds(`/products?notInLotId=${lot.id}`, 25);
        const expected = await prisma.product.count({
            where: { OR: [{ lotId: null }, { lotId: { not: lot.id } }] },
        });
        assert.equal(total, expected);
        const inLot = await prisma.product.findMany({ where: { lotId: lot.id }, select: { id: true } });
        assert.ok(inLot.every(product => !ids.includes(product.id)));
    });

    test("lotId and notInLotId together are rejected", async () => {
        const { status } = await get("/products?lotId=1&notInLotId=2");
        assert.equal(status, 400);
    });

    test("user filters by role", async () => {
        const body = await getList("/users?role=ADMIN&pageSize=100");
        assert.equal(body.pagination.total, await prisma.user.count({ where: { role: "ADMIN" } }));
        assert.ok(body.data.every(user => user.role === "ADMIN"));
    });

    test("designations include relation counts", async () => {
        const body = await getList("/designations?pageSize=100");
        for (const row of body.data) {
            const counts = row._count as { lots: number; products: number; specifications: number };
            assert.equal(counts.lots, await prisma.lot.count({ where: { designationId: Number(row.id) } }));
            assert.equal(counts.products, await prisma.product.count({ where: { designationId: Number(row.id) } }));
        }
    });
});

describe("user list safety", () => {
    test("never returns password hashes or tokens", async () => {
        const body = await getList("/users?pageSize=100");
        for (const user of body.data) {
            assert.equal("password" in user, false);
            assert.equal("refreshTokens" in user, false);
            assert.equal("authSessions" in user, false);
        }
    });
});

describe("dashboard summary", () => {
    test("matches database counts, including totals over 100", async () => {
        const { status, body } = await get("/dashboard/summary");
        assert.equal(status, 200);
        const summary = body as {
            users: { total: number };
            providers: { total: number };
            lots: { total: number; withSpecification: number; withoutSpecification: number };
            products: { total: number };
            specifications: { total: number };
        };
        assert.equal(summary.users.total, await prisma.user.count());
        assert.equal(summary.providers.total, await prisma.provider.count());
        assert.equal(summary.products.total, await prisma.product.count());
        assert.equal(summary.specifications.total, await prisma.specifications.count());
        assert.equal(summary.lots.total, await prisma.lot.count());
        assert.equal(
            summary.lots.withSpecification,
            await prisma.lot.count({ where: { specificationsId: { not: null } } }),
        );
        assert.equal(
            summary.lots.withSpecification + summary.lots.withoutSpecification,
            summary.lots.total,
        );
    });

    test("rejects unsupported parameters", async () => {
        const { status } = await get("/dashboard/summary?pageSize=10");
        assert.equal(status, 400);
    });

    test("requires authentication", async () => {
        const { status } = await get("/dashboard/summary", null);
        assert.equal(status, 401);
    });
});

describe("permissions are unchanged", () => {
    test("inactive accounts are refused", async () => {
        const inactive = await prisma.user.findFirst({ where: { status: false }, select: { id: true } });
        if (!inactive) return;
        const { status } = await get("/lots", tokenFor(inactive.id));
        assert.equal(status, 401);
    });

    test("non-admin roles cannot list users or read the dashboard summary", async (t) => {
        const nonAdmin = await prisma.user.findFirst({
            where: { status: true, role: { not: "ADMIN" } },
            select: { id: true, role: true },
        });
        if (!nonAdmin) {
            t.skip("no active non-admin user in this database");
            return;
        }
        const token = tokenFor(nonAdmin.id);
        assert.equal((await get("/users", token)).status, 403);
        assert.equal((await get("/dashboard/summary", token)).status, 403);
        // Products are admin-only; specifications are open to every role.
        assert.equal((await get("/products", token)).status, 403);
        assert.equal((await get("/specifications", token)).status, 200);
    });
});
