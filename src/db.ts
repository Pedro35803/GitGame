import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./env";

export const db: PrismaClient = new PrismaClient();

(async () => {
  await db.$connect();
  const listAdmin = await db.admin.findMany();
  const passHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  if (listAdmin.length <= 0) {
    await db.user.create({
      data: {
        userLogged: {
          create: {
            email: ADMIN_EMAIL,
            password: passHash,
            admin: {
              create: {
                second_password: passHash,
                privilegies: {
                  create: {
                    canEditPrivilegiesAdmin: true,
                    canReorderContentGame: true,
                    canManageContentGame: true,
                    canManageCRUDReports: true,
                    canManageCRUDPlayer: true,
                    canViewAllAdmin: true,
                    canCreateAdmin: true,
                    canDeleteAdmin: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
})();
