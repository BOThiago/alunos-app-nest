import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function UserAdmin() {
  const prisma = new PrismaClient();

  const verifyAdmin = await prisma.login.findMany({
    where: {
      login: process.env.USER_ADMIN,
    },
  });

  if (verifyAdmin.length < 1) {
    const hashedPassword = await bcrypt.hash(
      process.env.USER_ADMIN_PASSWORD,
      10
    );

    await prisma.login.create({
      data: {
        login: process.env.USER_ADMIN,
        password: hashedPassword,
      },
    });
  }
}
