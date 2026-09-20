import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME;
  const name = process.env.SEED_ADMIN_NAME;
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !plainPassword) {
    throw new Error(
      "Missing SEED_ADMIN_USERNAME or SEED_ADMIN_PASSWORD",
    );
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const admin = await prisma.user.upsert({
    where: { username },

    update: {
      password: hashedPassword,
      role: "ADMIN",
    },

    create: {
      name: name || "Admin",
      username,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin account ready: ${admin.username}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });