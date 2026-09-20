-- AlterTable: allow unknown sponsorship (XLSX has NA/N/A/blank) + add XLSX columns
ALTER TABLE "graduationProjects" ALTER COLUMN "isSponsored" DROP NOT NULL,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "supervisorEmail" TEXT,
ADD COLUMN     "coSupervisorEmail" TEXT,
ADD COLUMN     "projectSummary" TEXT,
ADD COLUMN     "companyMentorName" TEXT;

-- CreateIndex: dashboard filters (university, year, company)
CREATE INDEX "graduationProjects_university_idx" ON "graduationProjects"("university");
CREATE INDEX "graduationProjects_graduationYear_idx" ON "graduationProjects"("graduationYear");
CREATE INDEX "graduationProjects_companyName_idx" ON "graduationProjects"("companyName");
