-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "hasFrecuency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;
