import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
    const username = process.env.SEED_ADMIN_USERNAME;
    const name = process.env.SEED_ADMIN_NAME;
    const plainPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!username) {
        throw new Error("Missing SEED_ADMIN_USERNAME");
    }

    const existing = await prisma.user.findUnique({
        where: { username },
        select: {
            role: true,
            status: true,
        },
    });

    if (existing) {
        if (existing.role !== "ADMIN" || !existing.status) {
            throw new Error(
                "Seed username belongs to a non-admin or disabled account",
            );
        }

        console.log("Active admin already exists; no changes made.");
        return;
    }

    if (!plainPassword) {
        throw new Error("Missing SEED_ADMIN_PASSWORD");
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    await prisma.user.create({
        data: {
            name: name || "Admin",
            username,
            password: hashedPassword,
            role: "ADMIN",
            status: true,
        },
    });

    console.log("Initial admin created.");
}

main()
    .catch(() => {
        console.error(
            "Admin seed failed. Check seed configuration, account conflicts, and database connectivity.",
        );
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });