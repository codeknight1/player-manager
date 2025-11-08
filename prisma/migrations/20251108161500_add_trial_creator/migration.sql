ALTER TABLE "Trial"
ADD COLUMN "fee" REAL NOT NULL DEFAULT 0,
ADD COLUMN "createdById" TEXT;

ALTER TABLE "Trial"
ADD CONSTRAINT "Trial_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Trial_createdById_idx" ON "Trial"("createdById");

