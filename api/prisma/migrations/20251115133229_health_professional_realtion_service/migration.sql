-- AlterTable
ALTER TABLE "health_professionals" ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "health_professionals" ADD CONSTRAINT "health_professionals_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
