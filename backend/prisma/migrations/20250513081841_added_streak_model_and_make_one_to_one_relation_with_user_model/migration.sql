-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastLoginDate" TIMESTAMP(3) NOT NULL,
    "lastCodeSubmissionDate" TIMESTAMP(3) NOT NULL,
    "loginStreak" INTEGER NOT NULL,
    "codeSubmissionStreak" INTEGER NOT NULL,
    "longestLoginStreak" INTEGER NOT NULL,
    "longestCodeSubmissionStreak" INTEGER NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Streak_userId_key" ON "Streak"("userId");

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
