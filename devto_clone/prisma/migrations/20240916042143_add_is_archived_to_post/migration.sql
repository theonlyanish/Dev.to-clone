-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Post_createdById_createdAt_idx" ON "Post"("createdById", "createdAt");
