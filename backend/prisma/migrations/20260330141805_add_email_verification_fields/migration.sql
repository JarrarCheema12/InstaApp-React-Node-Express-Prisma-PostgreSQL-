-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token" VARCHAR(255),
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);
