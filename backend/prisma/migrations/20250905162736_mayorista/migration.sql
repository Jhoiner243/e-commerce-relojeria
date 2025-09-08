-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "mayorista" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mayoristaPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Mayorista" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Mayorista_pkey" PRIMARY KEY ("id")
);
