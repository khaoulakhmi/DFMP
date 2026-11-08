/** Copy to backend/prisma/seed-test-data.ts. Run from backend with:
 * SEED_TEST_DATA=true npx tsx prisma/seed-test-data.ts
 * Loads .env; prefers DATABASE_URL_HOST over DATABASE_URL.
 * Fixtures are insert-only. Rerunning preserves edits to existing fixtures.
 * Do not rename fixture marker fields if you want reruns to recognize them.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const PREFIX = "[DFMP-TEST-v1]";
const groups = ["Medical", "Food", "Cleaning", "Office", "IT", "Furniture"] as const;
const pad = (n: number) => String(n).padStart(3, "0");
const date = (day: number) => new Date(Date.UTC(2026, 0, day));
// Build decimal strings from integer cents, avoiding floating-point arithmetic.
const money = (cents: number) => `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
let prisma: PrismaClient | undefined;

async function main() {
    if (process.env.NODE_ENV === "production" || process.env.SEED_TEST_DATA !== "true") {
        throw new Error("Test seed requires SEED_TEST_DATA=true and a non-production environment.");
    }
    const connectionString = process.env.DATABASE_URL_HOST || process.env.DATABASE_URL;
    if (!connectionString) throw new Error("Set DATABASE_URL_HOST or DATABASE_URL.");
    const url = new URL(connectionString);
    const schema = url.searchParams.get("schema") ?? "public";
    console.log(`Test seed target: ${url.hostname}:${url.port || "5432"}${url.pathname}, schema=${schema}`);
    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }, { schema }) });

    const result = await prisma.$transaction(async (tx) => {
        // Serialize concurrent runs of this script, including name-based lookups.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(7319032026::bigint)`;
        const examples: { designationId: number; lotId: number; company: string }[] = [];
        let created = 0;
        let existing = 0;

        // Fail on ambiguous marker names rather than attaching records arbitrarily.
        async function ensure<T>(lookup: () => Promise<T[]>, create: () => Promise<T>): Promise<T> {
            const matches = await lookup();
            if (matches.length > 1) throw new Error("Duplicate test fixture markers found. Resolve duplicates before rerunning.");
            const first = matches[0];
            if (first !== undefined) { existing++; return first; }
            const record = await create();
            created++;
            return record;
        }

        for (const [g, group] of groups.entries()) {
            const designationName = `${PREFIX} ${group}`;
            const designation = await ensure(
                () => tx.designation.findMany({ where: { name: designationName }, take: 2 }),
                () => tx.designation.create({ data: { name: designationName, description: `Synthetic ${group} test category` } }),
            );
            const providers = [];
            for (let p = 1; p <= 10; p++) {
                const n = g * 10 + p;
                const email = `dfmp-test-v1-${pad(n)}@example.test`;
                const provider = await ensure(
                    () => tx.provider.findMany({ where: { email }, take: 2 }),
                    () => tx.provider.create({ data: {
                        name: `${PREFIX} ${group} Provider ${pad(p)}`,
                        company: `${PREFIX} ${group} Supplies`, email,
                        phone: `000000${String(n).padStart(4, "0")}`,
                        bankAccountNumber: `000000000000${String(n).padStart(8, "0")}`,
                        bankName: "TEST BANK - FICTIONAL", NIF: `000000${String(n).padStart(9, "0")}`,
                        NIS: `00000${String(n).padStart(10, "0")}`,
                        address: `Synthetic address ${n}, Algeria`,
                        commercialRegisterNumber: `TEST-${pad(n)}`,
                        createdAt: date(n),
                    } }),
                );
                providers.push(provider);
            }

            for (let s = 1; s <= 2; s++) {
                const type = `${PREFIX} ${group} Specification ${s}`;
                const specification = await ensure(
                    () => tx.specifications.findMany({ where: { type }, take: 2 }),
                    () => tx.specifications.create({ data: {
                        type, designationId: designation.id, year: 2025 + s,
                        minAmount: "10000.00", maxAmount: "500000.00",
                    } }),
                );
                await ensure(
                    () => tx.tendering.findMany({ where: { specificationsId: specification.id }, take: 2 }),
                    () => tx.tendering.create({ data: {
                        specificationsId: specification.id, delayPeriodDays: 10,
                        openingDate: date(g * 5 + s), avsStatus: s === 1 ? "FONDU" : "NON_FONDU",
                    } }),
                );

                for (let l = 1; l <= 2; l++) {
                    const lotNumber = (s - 1) * 2 + l;
                    const name = `${PREFIX} ${group} Lot ${lotNumber}`;
                    const lot = await ensure(
                        () => tx.lot.findMany({ where: { name }, take: 2 }),
                        () => tx.lot.create({ data: {
                            name, designationId: designation.id, specificationsId: specification.id,
                            createdAt: date(g * 4 + lotNumber),
                        } }),
                    );
                    if (lotNumber === 1) examples.push({ designationId: designation.id, lotId: lot.id, company: `${PREFIX} ${group} Supplies` });
                    for (let p = 1; p <= 5; p++) {
                        const n = g * 20 + (lotNumber - 1) * 5 + p;
                        const productName = `${PREFIX} ${group} Product ${pad(n)}`;
                        await ensure(
                            () => tx.product.findMany({ where: { name: productName }, take: 2 }),
                            () => tx.product.create({ data: {
                                name: productName, unit: p % 2 === 0 ? "box" : "piece",
                                designationId: designation.id,
                                lotId: p === 5 ? null : lot.id,
                                unitPrice: money(10000 + n * 137),
                                evaluationPrice: p === 5 ? null : money(11000 + n * 137),
                                providerPrice: p === 5 ? null : money(9000 + n * 137),
                                tva: p % 3 === 0 ? "ZERO" : p % 3 === 1 ? "NINE" : "NINETEEN",
                                quantityMin: 5 + p, quantityMax: 50 + p * 10,
                                createdAt: date(n),
                            } }),
                        );
                    }

                    // One market per specification (two per category).
                    if (l === 1) {
                        const provider = providers[s - 1];
                        if (!provider) throw new Error("Missing provider fixture.");
                        const marketNumber = `DFMP-TEST-v1-M-${pad(g * 2 + s)}`;
                        const market = await ensure(
                            () => tx.market.findMany({ where: { marketNumber }, take: 2 }),
                            () => tx.market.create({ data: {
                                marketNumber, providerId: provider.id, lotId: lot.id,
                                date: date(g * 5 + s), createdAt: date(g * 5 + s),
                                status: g % 3 === 0 ? "PENDING" : g % 3 === 1 ? "APPROVED" : "REJECTED",
                            } }),
                        );
                        for (let i = 1; i <= 3; i++) {
                            const invoiceNumber = `${marketNumber}-I-${i}`;
                            await ensure(
                                () => tx.invoice.findMany({ where: { invoiceNumber }, take: 2 }),
                                () => tx.invoice.create({ data: {
                                    invoiceNumber, providerId: market.providerId, marketId: market.id,
                                    amount: money(250000 + i * 12500), quantity: i * 10,
                                    createdAt: date(g * 5 + s + i),
                                } }),
                            );
                        }
                    }
                }
            }
        }
        for (let r = 1; r <= 3; r++) {
            const name = `${PREFIX} Residence ${r}`;
            const residence = await ensure(
                () => tx.residence.findMany({ where: { name }, take: 2 }),
                () => tx.residence.create({ data: { name, address: `Synthetic campus ${r}`, numberOfUnits: 100 * r } }),
            );
            for (let n = 1; n <= 2; n++) {
                const restaurantName = `${PREFIX} Restaurant ${r}-${n}`;
                await ensure(
                    () => tx.restaurant.findMany({ where: { name: restaurantName }, take: 2 }),
                    () => tx.restaurant.create({ data: { name: restaurantName, residenceId: residence.id } }),
                );
            }
        }
        return { created, existing, examples };
    }, { maxWait: 10000, timeout: 120000 });

    console.log(`Completed: ${result.created} created; ${result.existing} existing fixtures preserved.`);
    console.table(result.examples);
    console.log("Expected fixture set: 60 providers, 6 designations, 24 lots, 120 products,");
    console.log("12 specifications, 12 tenderings, 12 markets, 36 invoices, 3 residences, 6 restaurants.");
    console.log("24 products intentionally have no lot. Existing users and authentication data are untouched.");
}

main().catch((error: unknown) => {
    console.error(error);
    // Do not print a connection string or arbitrary database error details.
    if (error instanceof Error && [
        "Test seed requires", "Set DATABASE", "Duplicate test", "Missing provider",
    ].some(prefix => error.message.startsWith(prefix))) {
        console.error(error.message);
    } else {
        console.error("Test seed failed. Check database connectivity, applied migrations and generated Prisma client. Transactional fixture writes were rolled back.");
    }
    process.exitCode = 1;
}).finally(async () => { await prisma?.$disconnect(); });
