-- CreateTable
CREATE TABLE "FunctionVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "functionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "code" TEXT,
    "flowData" TEXT,
    "trigger" TEXT NOT NULL,
    "intervalMs" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "comment" TEXT,
    CONSTRAINT "FunctionVersion_functionId_fkey" FOREIGN KEY ("functionId") REFERENCES "Function" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlowExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flowId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'running',
    "logs" TEXT NOT NULL,
    "error" TEXT,
    "duration" INTEGER,
    CONSTRAINT "FlowExecution_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Function" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "code" TEXT,
    "flowData" TEXT,
    "trigger" TEXT NOT NULL,
    "intervalMs" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Function_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Function" ("code", "createdAt", "description", "deviceId", "flowData", "id", "intervalMs", "name", "trigger", "type", "updatedAt") SELECT "code", "createdAt", "description", "deviceId", "flowData", "id", "intervalMs", "name", "trigger", "type", "updatedAt" FROM "Function";
DROP TABLE "Function";
ALTER TABLE "new_Function" RENAME TO "Function";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
