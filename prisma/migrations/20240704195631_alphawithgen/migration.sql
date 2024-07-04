/*
  Warnings:

  - You are about to drop the column `email` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `promoCodeId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sizeValue` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `PromoCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_promoCodeId_fkey";

-- DropForeignKey
ALTER TABLE "PromoCode" DROP CONSTRAINT "PromoCode_storeId_fkey";

-- DropIndex
DROP INDEX "Order_id_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "email",
DROP COLUMN "promoCodeId",
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "sizeValue";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
DROP COLUMN "details";

-- DropTable
DROP TABLE "PromoCode";
