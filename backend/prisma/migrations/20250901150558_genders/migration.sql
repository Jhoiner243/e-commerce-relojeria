-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('All', 'Hombre', 'Mujer', 'Niños', 'Parejas');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "gender" "public"."Gender" NOT NULL DEFAULT 'Hombre';
