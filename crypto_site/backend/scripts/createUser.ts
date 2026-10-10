// backend/scripts/createUser.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "compte32@eventia.com" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: "compte32@eventia.com",
        password: "compte32",
        fullName: "Compte 32",
      },
    });
    console.log("✅ Utilisateur créé !");
  } else {
    console.log("ℹ️ Utilisateur déjà existant. Aucun changement.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
