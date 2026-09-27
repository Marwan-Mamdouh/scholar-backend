-- CreateIndex
CREATE INDEX "idx_journal_search" ON "academicPublications" USING GIN("search_vector");
