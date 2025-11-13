-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('CITIZEN', 'RECEPTIONIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."SchedulingStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'ATTENDED', 'MISSED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "type" "public"."UserType" NOT NULL DEFAULT 'CITIZEN',
    "zipcode" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schedulings" (
    "id" TEXT NOT NULL,
    "availableTimeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."SchedulingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmCode" TEXT NOT NULL,

    CONSTRAINT "schedulings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."available_times" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "healthProfessionalId" TEXT NOT NULL,
    "ubsId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "available_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."health_professionals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "ubsId" TEXT NOT NULL,

    CONSTRAINT "health_professionals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scheduling_logs" (
    "id" TEXT NOT NULL,
    "schedulingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduling_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "public"."User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schedulings_availableTimeId_key" ON "public"."schedulings"("availableTimeId");

-- CreateIndex
CREATE UNIQUE INDEX "schedulings_confirmCode_key" ON "public"."schedulings"("confirmCode");

-- CreateIndex
CREATE UNIQUE INDEX "health_professionals_crm_key" ON "public"."health_professionals"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "public"."services"("name");

-- AddForeignKey
ALTER TABLE "public"."schedulings" ADD CONSTRAINT "schedulings_availableTimeId_fkey" FOREIGN KEY ("availableTimeId") REFERENCES "public"."available_times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedulings" ADD CONSTRAINT "schedulings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."available_times" ADD CONSTRAINT "available_times_healthProfessionalId_fkey" FOREIGN KEY ("healthProfessionalId") REFERENCES "public"."health_professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."available_times" ADD CONSTRAINT "available_times_ubsId_fkey" FOREIGN KEY ("ubsId") REFERENCES "public"."ubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."available_times" ADD CONSTRAINT "available_times_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."health_professionals" ADD CONSTRAINT "health_professionals_ubsId_fkey" FOREIGN KEY ("ubsId") REFERENCES "public"."ubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling_logs" ADD CONSTRAINT "scheduling_logs_schedulingId_fkey" FOREIGN KEY ("schedulingId") REFERENCES "public"."schedulings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduling_logs" ADD CONSTRAINT "scheduling_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
