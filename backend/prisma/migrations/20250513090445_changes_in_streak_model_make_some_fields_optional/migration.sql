-- AlterTable
ALTER TABLE "Streak" ALTER COLUMN "lastCodeSubmissionDate" DROP NOT NULL,
ALTER COLUMN "loginStreak" DROP NOT NULL,
ALTER COLUMN "codeSubmissionStreak" DROP NOT NULL,
ALTER COLUMN "longestLoginStreak" DROP NOT NULL,
ALTER COLUMN "longestCodeSubmissionStreak" DROP NOT NULL;
