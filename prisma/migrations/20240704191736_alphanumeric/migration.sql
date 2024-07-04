/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `promoCodeId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeValue` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "promoCodeId" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_alphanumeric_id();

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "sizeValue" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "details" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromoCode_storeId_idx" ON "PromoCode"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
