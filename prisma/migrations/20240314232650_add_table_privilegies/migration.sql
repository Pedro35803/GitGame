-- CreateTable
CREATE TABLE "Privilegies" (
    "id" TEXT NOT NULL,
    "id_admin" TEXT NOT NULL,
    "canCreateAdmin" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteAdmin" BOOLEAN NOT NULL DEFAULT false,
    "canViewAllAdmin" BOOLEAN NOT NULL DEFAULT false,
    "canEditPrivilegiesAdmin" BOOLEAN NOT NULL DEFAULT false,
    "canManageCRUDPlayer" BOOLEAN NOT NULL DEFAULT false,
    "canManageCRUDReports" BOOLEAN NOT NULL DEFAULT true,
    "canManageContentGame" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk_privilegies" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Privilegies_id_admin_key" ON "Privilegies"("id_admin");

-- AddForeignKey
ALTER TABLE "Privilegies" ADD CONSTRAINT "fk_privilegies_admin" FOREIGN KEY ("id_admin") REFERENCES "Admin"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
