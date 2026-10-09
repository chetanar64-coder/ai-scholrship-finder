-- CreateTable
CREATE TABLE "Scholarship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "minCgpa" REAL NOT NULL,
    "maxIncome" REAL NOT NULL,
    "eligibleCategories" TEXT NOT NULL,
    "eligibleCourses" TEXT NOT NULL,
    "maxSemester" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    "applyLink" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
