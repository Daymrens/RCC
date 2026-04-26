-- CreateTable
CREATE TABLE "CodeTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'code',
    "code" TEXT,
    "flowData" TEXT,
    "trigger" TEXT NOT NULL DEFAULT 'manual',
    "intervalMs" INTEGER,
    "tags" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
