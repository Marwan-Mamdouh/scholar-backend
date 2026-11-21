-- Generated from Sphinx.xlsx by import.py.
-- Requires universityStaff.email to be nullable and non-unique: the workbook has
-- blank and repeated emails, while the supplied Prisma schema currently requires
-- a unique, non-null email. Apply the corresponding schema migration first.
-- This import includes 1 staff rows and should be run only once;
-- rerunning it will add duplicate staff rows.
SET client_encoding = 'UTF8';

BEGIN;

INSERT INTO "universities" ("name", "createdAt", "updatedAt") VALUES
    ('Sphinx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;
INSERT INTO "faculties" ("name", "universityId", "createdAt", "updatedAt") VALUES
    ('faculty of physical therapy', (SELECT "id" FROM "universities" WHERE "name" = 'Sphinx'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name", "universityId") DO NOTHING;
INSERT INTO "departments" ("name", "facultyId", "createdAt", "updatedAt") VALUES
    ('Not Specified', (SELECT f."id" FROM "faculties" AS f JOIN "universities" AS u ON u."id" = f."universityId" WHERE f."name" = 'faculty of physical therapy' AND u."name" = 'Sphinx'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name", "facultyId") DO NOTHING;
INSERT INTO "universityStaff" ("name", "email", "alternativeEmail", "mobile", "title", "degree", "facultyId", "departmentId", "universityId", "universityProfileLink", "cvLink", "researchGateLink", "googleScholarLink", "academiaLink", "linkedInLink", "youtubeLink", "orcidLink", "scopusLink", "titleProfile", "facultyProfile", "citations", "researchInterests", "bio", "otherUrl", "createdAt", "updatedAt") VALUES
    ('Hala Ahmed Abd Elgawad', NULL, NULL, NULL, 'Professor', 'Professor', (SELECT f."id" FROM "faculties" AS f JOIN "universities" AS u ON u."id" = f."universityId" WHERE f."name" = 'faculty of physical therapy' AND u."name" = 'Sphinx'), (SELECT d."id" FROM "departments" AS d JOIN "faculties" AS f ON f."id" = d."facultyId" JOIN "universities" AS u ON u."id" = f."universityId" WHERE d."name" = 'Not Specified' AND f."name" = 'faculty of physical therapy' AND u."name" = 'Sphinx'), (SELECT "id" FROM "universities" WHERE "name" = 'Sphinx'), 'https://scholar.google.com/citations?hl=en&user=abS9oYUAAAAJ', NULL, NULL, 'https://scholar.google.com/citations?hl=en&user=abS9oYUAAAAJ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 28, ARRAY['medical']::TEXT[], NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
