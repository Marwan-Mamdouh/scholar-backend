--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1+b1)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1+b1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ApplicationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ApplicationStatus" AS ENUM (
    'pending',
    'reviewed',
    'accepted',
    'rejected'
);


--
-- Name: FeedbackCategory; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FeedbackCategory" AS ENUM (
    'bug',
    'feature',
    'data',
    'other'
);


--
-- Name: JobType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."JobType" AS ENUM (
    'fullTime',
    'partTime',
    'internship'
);


--
-- Name: LicenseType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LicenseType" AS ENUM (
    'CC',
    'CC BY',
    'CC BY-SA',
    'CC BY-NC',
    'CC BY-ND',
    'CC BY-NC-ND'
);


--
-- Name: PresenceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PresenceStatus" AS ENUM (
    'active',
    'inactive'
);


--
-- Name: PublicationAccessType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublicationAccessType" AS ENUM (
    'Hybrid',
    'Full Open Access',
    'Golden Open Access',
    'Diamond Open Access',
    'Green Open Access',
    'Bronze Open Access',
    'Subscriber Based Access'
);


--
-- Name: PublicationIndex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublicationIndex" AS ENUM (
    'SCIE',
    'ESCI',
    'SSCI'
);


--
-- Name: PublicationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublicationType" AS ENUM (
    'Transaction',
    'Magazine',
    'Journal',
    'Letter'
);


--
-- Name: Publisher; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Publisher" AS ENUM (
    'IEEE',
    'APS',
    'Royal Society',
    'ACS',
    'ACM',
    'Taylor & Francis',
    'Oxford',
    'ElSevier',
    'Springer',
    'Sage',
    'MDPI'
);


--
-- Name: Quartile; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Quartile" AS ENUM (
    'Q1',
    'Q2',
    'Q3',
    'Q4'
);


--
-- Name: SeniorityLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SeniorityLevel" AS ENUM (
    'junior',
    'mid',
    'senior',
    'lead'
);


--
-- Name: SubBucket; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SubBucket" AS ENUM (
    'Core Hybrid Proprietary English',
    'Core Hybrid Society English',
    'Core Gold',
    'Cell Press Gold',
    'Cell Press Hybrid Proprietary',
    'Cell Press Hybrid Society',
    'Core Hybrid Local Language',
    'TL Subscription',
    'The Lancet Gold'
);


--
-- Name: TeamCategory; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TeamCategory" AS ENUM (
    'web',
    'industry',
    'academia'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'student',
    'graduate',
    'admin'
);


--
-- Name: Workflow; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Workflow" AS ENUM (
    'standard',
    'non-standard'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: PublicationEditorialStat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PublicationEditorialStat" (
    id integer NOT NULL,
    "publicationId" integer NOT NULL,
    "submissionToFirstDecision" numeric(10,2),
    "submissionToReviewDecision" numeric(10,2),
    "submissionToAcceptance" numeric(10,2),
    "acceptanceToPublication" numeric(10,2),
    "acceptanceRate" numeric(10,2),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PublicationEditorialStat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PublicationEditorialStat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PublicationEditorialStat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PublicationEditorialStat_id_seq" OWNED BY public."PublicationEditorialStat".id;


--
-- Name: PublicationPricing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PublicationPricing" (
    id integer NOT NULL,
    "publicationId" integer NOT NULL,
    "pricingYear" integer NOT NULL,
    currency character varying(3) NOT NULL,
    cost numeric(10,2) NOT NULL,
    "isSubscription" boolean DEFAULT false,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PublicationPricing_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PublicationPricing_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PublicationPricing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PublicationPricing_id_seq" OWNED BY public."PublicationPricing".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: academicPublications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."academicPublications" (
    id integer NOT NULL,
    "subCategoryId" integer NOT NULL,
    acronym character varying(100),
    title text NOT NULL,
    issn character(8),
    eissn character(8),
    "specificFocusScope" character varying(500),
    "journalScope" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publicationType" public."PublicationType" NOT NULL,
    "openAccessType" public."PublicationAccessType" NOT NULL,
    "URL" character varying(500),
    imprint text,
    "issnCdrom" character(8),
    "licenseType" public."LicenseType",
    publisher public."Publisher" NOT NULL,
    "subBucket" public."SubBucket",
    workflow public."Workflow" NOT NULL,
    "yearLunched" integer,
    search_vector tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('english'::regconfig, COALESCE(title, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE("journalScope", ''::text)), 'B'::"char"))) STORED
);


--
-- Name: academicPublications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."academicPublications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: academicPublications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."academicPublications_id_seq" OWNED BY public."academicPublications".id;


--
-- Name: academicResearchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."academicResearchers" (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "institutionName" text NOT NULL,
    department text,
    affiliation text,
    "mainTopic" text,
    subtopics jsonb,
    "scholarId" text,
    "linkedinUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: academicResearchers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."academicResearchers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: academicResearchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."academicResearchers_id_seq" OWNED BY public."academicResearchers".id;


--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    issuer text
);


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name text NOT NULL,
    industry text,
    size text,
    website text,
    linkedin text,
    glassdoor text,
    "headquartersCountry" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: companyBranches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."companyBranches" (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    region text,
    country text,
    state text,
    city text,
    presence public."PresenceStatus"
);


--
-- Name: companyBranches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."companyBranches_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: companyBranches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."companyBranches_id_seq" OWNED BY public."companyBranches".id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name text NOT NULL,
    "shortName" text,
    website text,
    description text,
    "facultyId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: faculties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculties (
    id integer NOT NULL,
    name text NOT NULL,
    "shortName" text,
    website text,
    description text,
    "universityId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: faculties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faculties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculties_id_seq OWNED BY public.faculties.id;


--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedbacks (
    id integer NOT NULL,
    "userId" text,
    "firstName" text,
    "lastName" text,
    email text,
    category public."FeedbackCategory",
    message text NOT NULL,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedbacks_id_seq OWNED BY public.feedbacks.id;


--
-- Name: graduationProjectApplications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."graduationProjectApplications" (
    id integer NOT NULL,
    "projectId" integer NOT NULL,
    "applicantUserId" text NOT NULL,
    "teamMembers" jsonb,
    "proposalSummaryUrl" text,
    status public."ApplicationStatus" DEFAULT 'pending'::public."ApplicationStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: graduationProjectApplications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."graduationProjectApplications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: graduationProjectApplications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."graduationProjectApplications_id_seq" OWNED BY public."graduationProjectApplications".id;


--
-- Name: graduationProjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."graduationProjects" (
    id integer NOT NULL,
    "isSponsored" boolean NOT NULL,
    "sponsorCompanyId" integer,
    university text,
    faculty text,
    industry text,
    domains jsonb,
    supervisor text,
    "coSupervisor" text,
    "projectTitle" text NOT NULL,
    "noOfStudents" integer,
    "documentationLink" text,
    "postedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: graduationProjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."graduationProjects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: graduationProjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."graduationProjects_id_seq" OWNED BY public."graduationProjects".id;


--
-- Name: jobApplications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."jobApplications" (
    id integer NOT NULL,
    "jobId" integer NOT NULL,
    "applicantUserId" text NOT NULL,
    "cvPath" text,
    status public."ApplicationStatus" DEFAULT 'pending'::public."ApplicationStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: jobApplications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."jobApplications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobApplications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."jobApplications_id_seq" OWNED BY public."jobApplications".id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "branchId" integer NOT NULL,
    title text NOT NULL,
    industry text,
    domains jsonb,
    type public."JobType",
    seniority public."SeniorityLevel",
    description text,
    requirements text,
    salary text,
    "applyLink" text,
    "postedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    gender text,
    country text,
    governorate text,
    university text,
    faculty text,
    department text,
    "graduationYear" integer,
    "linkedinUrl" text,
    "githubUrl" text,
    "scholarUrl" text,
    skills jsonb,
    experience jsonb
);


--
-- Name: publicationDomains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."publicationDomains" (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: publicationDomains_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."publicationDomains_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publicationDomains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."publicationDomains_id_seq" OWNED BY public."publicationDomains".id;


--
-- Name: publicationSubcategories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."publicationSubcategories" (
    id integer NOT NULL,
    "domainId" integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: publicationSubcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."publicationSubcategories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publicationSubcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."publicationSubcategories_id_seq" OWNED BY public."publicationSubcategories".id;


--
-- Name: publicationYearlyMetrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."publicationYearlyMetrics" (
    id integer NOT NULL,
    "publicationId" integer NOT NULL,
    "metricYear" integer NOT NULL,
    jci numeric(10,4),
    eigenfactor numeric(10,6),
    "articleInfluenceScore" numeric(10,4),
    citescore numeric(10,4),
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "indexingService" public."PublicationIndex",
    quartile public."Quartile",
    "articleDownloads" integer NOT NULL,
    "h5Index" numeric(10,4),
    "impactFactor" numeric(10,4),
    "impactFactor5yr" numeric(10,4),
    sjr numeric(10,4),
    "totalCitations" integer NOT NULL
);


--
-- Name: publicationYearlyMetrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."publicationYearlyMetrics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publicationYearlyMetrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."publicationYearlyMetrics_id_seq" OWNED BY public."publicationYearlyMetrics".id;


--
-- Name: researchPapers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."researchPapers" (
    id integer NOT NULL,
    "putCode" bigint,
    "orcidPath" text,
    title text NOT NULL,
    subtitle text,
    type text,
    "journalTitle" text,
    doi text,
    url text,
    "publicationYear" integer,
    "publicationMonth" integer,
    "publicationDay" integer,
    "sourceName" text,
    visibility text DEFAULT 'public'::text,
    "staffId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: researchPapers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."researchPapers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: researchPapers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."researchPapers_id_seq" OWNED BY public."researchPapers".id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    linkedin_url text,
    team public."TeamCategory" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: universities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.universities (
    id integer NOT NULL,
    name text NOT NULL,
    "shortName" text,
    website text,
    country text,
    city text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: universities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.universities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: universities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.universities_id_seq OWNED BY public.universities.id;


--
-- Name: universityStaff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."universityStaff" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "alternativeEmail" text,
    mobile text,
    title text,
    degree text,
    "facultyId" integer,
    "departmentId" integer,
    "universityId" integer NOT NULL,
    "universityProfileLink" text,
    "cvLink" text,
    "researchGateLink" text,
    "googleScholarLink" text,
    "academiaLink" text,
    "linkedInLink" text,
    "youtubeLink" text,
    "orcidLink" text,
    "scopusLink" text,
    "titleProfile" text,
    "facultyProfile" text,
    citations integer,
    "researchInterests" text[],
    bio text,
    "otherUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: universityStaff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."universityStaff_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: universityStaff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."universityStaff_id_seq" OWNED BY public."universityStaff".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    role public."UserRole" DEFAULT 'student'::public."UserRole",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    name text
);


--
-- Name: verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone
);


--
-- Name: PublicationEditorialStat id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PublicationEditorialStat" ALTER COLUMN id SET DEFAULT nextval('public."PublicationEditorialStat_id_seq"'::regclass);


--
-- Name: PublicationPricing id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PublicationPricing" ALTER COLUMN id SET DEFAULT nextval('public."PublicationPricing_id_seq"'::regclass);


--
-- Name: academicPublications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."academicPublications" ALTER COLUMN id SET DEFAULT nextval('public."academicPublications_id_seq"'::regclass);


--
-- Name: academicResearchers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."academicResearchers" ALTER COLUMN id SET DEFAULT nextval('public."academicResearchers_id_seq"'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: companyBranches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."companyBranches" ALTER COLUMN id SET DEFAULT nextval('public."companyBranches_id_seq"'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: faculties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculties ALTER COLUMN id SET DEFAULT nextval('public.faculties_id_seq'::regclass);


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);


--
-- Name: graduationProjectApplications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjectApplications" ALTER COLUMN id SET DEFAULT nextval('public."graduationProjectApplications_id_seq"'::regclass);


--
-- Name: graduationProjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjects" ALTER COLUMN id SET DEFAULT nextval('public."graduationProjects_id_seq"'::regclass);


--
-- Name: jobApplications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."jobApplications" ALTER COLUMN id SET DEFAULT nextval('public."jobApplications_id_seq"'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: publicationDomains id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationDomains" ALTER COLUMN id SET DEFAULT nextval('public."publicationDomains_id_seq"'::regclass);


--
-- Name: publicationSubcategories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationSubcategories" ALTER COLUMN id SET DEFAULT nextval('public."publicationSubcategories_id_seq"'::regclass);


--
-- Name: publicationYearlyMetrics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationYearlyMetrics" ALTER COLUMN id SET DEFAULT nextval('public."publicationYearlyMetrics_id_seq"'::regclass);


--
-- Name: researchPapers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."researchPapers" ALTER COLUMN id SET DEFAULT nextval('public."researchPapers_id_seq"'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: universities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.universities ALTER COLUMN id SET DEFAULT nextval('public.universities_id_seq'::regclass);


--
-- Name: universityStaff id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."universityStaff" ALTER COLUMN id SET DEFAULT nextval('public."universityStaff_id_seq"'::regclass);


--
-- Data for Name: PublicationEditorialStat; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PublicationEditorialStat" (id, "publicationId", "submissionToFirstDecision", "submissionToReviewDecision", "submissionToAcceptance", "acceptanceToPublication", "acceptanceRate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PublicationPricing; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PublicationPricing" (id, "publicationId", "pricingYear", currency, cost, "isSubscription", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e0ace5a6-ec03-4702-992f-5d13b7a34ad7	b032986628aee6fcbb24427d1104db0f263005d77d214bb119802d17b357dd19	2026-07-26 03:42:13.055571+03	20260613165004_init_scholar_db	\N	\N	2026-07-26 03:42:12.963925+03	1
4e84db5e-f3a2-49ae-a462-f3ea9379095f	e7ac7f0319dcd7069aa7fd7231fc32588938063e0359a3ecea05c6309faefabb	2026-07-26 03:42:13.108671+03	20260616001214_add_better_auth_schema	\N	\N	2026-07-26 03:42:13.057147+03	1
bf086f79-dd62-4cd2-9cce-9d4e51c70219	454428e051d573e2db66615431870ff7a136f258aa626e6e2f76d67f1dc5f560	2026-07-26 03:42:13.115183+03	20260616164746_change_user_role_to_optional	\N	\N	2026-07-26 03:42:13.110198+03	1
cff893fe-9c6f-4c42-8471-254fb554c868	b1f033dbc83481ac0f04313de352b8a7bfa963d9e6236bbe70ef8366bdd6230e	2026-07-26 03:42:13.121969+03	20260616165445_default_to_user_role	\N	\N	2026-07-26 03:42:13.116895+03	1
5fe4ab61-d11e-4e93-907a-db3e6bdb74b5	7fd28598f90465c7ddef1d1baaa770bb5d813b4d22ed21408b3f770ead2d46f2	2026-07-26 03:42:13.214325+03	20260721010818_add_university_faculty_department	\N	\N	2026-07-26 03:42:13.123657+03	1
c09e1adc-3b79-4efc-a2dd-ae289e682c33	571ead12934f3cfb66230ed204d30ad9d769ab7938a17b2cdbd6b9d0fd2f7355	2026-07-26 03:43:07.318739+03	20260726004307_add_research_papers	\N	\N	2026-07-26 03:43:07.303718+03	1
ea372e53-f205-467d-9dd3-57f24bb50a0c	1546fbad90aaa22fe2a10f3eb0d01e9dc105354460c6437b5ea67b177e7abd7e	2026-09-27 18:47:50.388639+03	20260824094432_enhance_publication_filtering	\N	\N	2026-09-27 18:47:50.323648+03	1
57cd17a2-7166-49a9-a8fe-bffc4a54269f	6a7ad0545a5d90ca4562772d0c92e1c0d98c60589af557d368e8c8b0a8be6ad1	2026-09-27 18:47:50.403024+03	20260824094519_add_fts_to_journals	\N	\N	2026-09-27 18:47:50.390287+03	1
ce9044c1-05c9-4a1c-974b-bc744fa7ab2d	3c079734f0eb2afe58a877047b0fa63c768d68b4da89178193055e5b729631e7	\N	20260927154900_enhance_staff_departments_research_papers_universities	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260927154900_enhance_staff_departments_research_papers_universities\n\nDatabase error code: 42601\n\nDatabase error:\nERROR: column "search_vector" of relation "academicPublications" is a generated column\nHINT: Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42601), message: "column \\"search_vector\\" of relation \\"academicPublications\\" is a generated column", detail: None, hint: Some("Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead."), position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7909), routine: Some("ATExecColumnDefault") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260927154900_enhance_staff_departments_research_papers_universities"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260927154900_enhance_staff_departments_research_papers_universities"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:255	2026-09-27 18:54:23.37935+03	2026-09-27 18:49:01.011928+03	0
85a40d5d-2002-4df3-8378-20faf70fc797	0706742b4baa1b74e131c8ae9b5c33ef0b7c18be160563d29259ddc325ebb507	\N	20260928211837_add_account_issuer	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260928211837_add_account_issuer\n\nDatabase error code: 42601\n\nDatabase error:\nERROR: column "search_vector" of relation "academicPublications" is a generated column\nHINT: Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42601), message: "column \\"search_vector\\" of relation \\"academicPublications\\" is a generated column", detail: None, hint: Some("Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead."), position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7909), routine: Some("ATExecColumnDefault") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260928211837_add_account_issuer"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260928211837_add_account_issuer"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:255	2026-09-29 00:20:37.112163+03	2026-09-29 00:18:37.644063+03	0
3dfa6214-1f93-4151-a348-420538c61949	504baeb75dfcf12affbabb633a9610c700c2aca70a0a207960a915dd131f5560	2026-09-29 00:29:47.87611+03	20260928211837_add_account_issuer		\N	2026-09-29 00:29:47.87611+03	0
\.


--
-- Data for Name: academicPublications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."academicPublications" (id, "subCategoryId", acronym, title, issn, eissn, "specificFocusScope", "journalScope", "createdAt", "updatedAt", "publicationType", "openAccessType", "URL", imprint, "issnCdrom", "licenseType", publisher, "subBucket", workflow, "yearLunched") FROM stdin;
20	5	MLJ	Machine Learning Journal	08856125	15730565	Machine learning, deep learning, statistical learning theory	Publishes research on all aspects of machine learning.	2026-09-28 23:10:41.603	2026-09-28 23:10:41.603	Journal	Golden Open Access	https://link.springer.com/journal/10994	Springer Nature	\N	\N	Springer	\N	standard	1986
21	6	TPAMI	IEEE Transactions on Pattern Analysis and Machine Intelligence	01628828	19393539	Pattern analysis, computer vision, image processing, machine intelligence	Publishes research on computer vision and pattern recognition.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34	IEEE	\N	\N	Springer	\N	standard	1979
22	7	CL	Computational Linguistics	08912017	15309312	Natural language processing, computational linguistics, language parsing	Dedicated to computational analysis of human language.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Diamond Open Access	https://direct.mit.edu/coli	MIT Press	\N	\N	Springer	\N	standard	1974
23	8	TSE	IEEE Transactions on Software Engineering	00985589	19393520	Software architecture, testing, verification, empirical software engineering	Leading journal in software engineering methods and practices.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=32	IEEE	\N	\N	Springer	\N	standard	1975
24	9	TIFS	IEEE Transactions on Information Forensics and Security	15566013	15566021	Cryptography, biometrics, network security, digital forensics	Focuses on information forensics, security, and privacy.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=10206	IEEE	\N	\N	Springer	\N	standard	2006
25	5	JMLR	Journal of Machine Learning Research	15324435	15337928	Theoretical and applied machine learning, neural networks, optimization	Provides an open access forum for machine learning research.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Diamond Open Access	https://www.jmlr.org/	JMLR	\N	\N	Springer	\N	standard	2000
26	10	JCO	Journal of Clinical Oncology	0732183X	15277755	Clinical oncology, cancer therapy, clinical trials, precision medicine	Publishes original research on diagnosis and treatment of cancer.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ascopubs.org/journal/jco	ASCO	\N	\N	Springer	\N	standard	1983
27	11	NEURON	Neuron	08966273	10974199	Cellular neuroscience, cognitive neuroscience, neural circuits, neurobiology	Highlights major advances in cellular and molecular neuroscience.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://www.cell.com/neuron/home	Cell Press	\N	\N	Springer	\N	standard	1988
28	12	NG	Nature Genetics	10614036	15461718	Human genetics, genomics, gene expression, epigenetics	Publishes research on human and organismal genetics and genomics.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://www.nature.com/ng/	Nature Portfolio	\N	\N	Springer	\N	standard	1992
29	10	LANCET-ONC	The Lancet Oncology	14702045	14745488	Global cancer control, clinical oncology, health policy	Leading global journal covering clinical oncology research.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://www.thelancet.com/journals/lanonc/home	The Lancet Publishing Group	\N	\N	Springer	\N	standard	2000
30	11	JNS	Journal of Neuroscience	02706474	15292401	Molecular, cellular, developmental, structural, and system neuroscience	Official journal of the Society for Neuroscience.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Subscriber Based Access	https://www.jneurosci.org/	SfN	\N	\N	Springer	\N	standard	1981
31	13	TRO	IEEE Transactions on Robotics	15523098	19410220	Autonomous robots, kinematics, haptics, robot learning, motion planning	Covers fundamental research in robotics and automation.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860	IEEE	\N	\N	Springer	\N	standard	2004
32	14	TPEL	IEEE Transactions on Power Electronics	08858993	19410107	Power conversion, semiconductor devices, motor drives, energy storage	Publishes advancements in power electronics circuits and systems.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=63	IEEE	\N	\N	Springer	\N	standard	1986
33	15	TBME	IEEE Transactions on Biomedical Engineering	00189294	15582531	Biomedical signal processing, neural engineering, medical imaging devices	Broad-scope coverage of biomedical engineering applications.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=10	IEEE	\N	\N	Springer	\N	standard	1954
34	13	IJRR	The International Journal of Robotics Research	02783649	17413176	Robotic systems, field robotics, perception, control algorithms	First scholarly journal devoted to robotics research.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://journals.sagepub.com/home/ijr	SAGE Publications	\N	\N	Springer	\N	standard	1982
35	16	APJ	The Astrophysical Journal	0004637X	15384357	Astronomy, astrophysics, cosmology, stellar dynamics, exoplanets	Leading peer-reviewed journal of astrophysics developments.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Golden Open Access	https://iopscience.iop.org/journal/0004-637X	IOP Publishing	\N	\N	Springer	\N	standard	1895
36	17	PRX-QUANTUM	PRX Quantum	\N	26913399	Quantum information, quantum computing, quantum optics, sensing	Open access journal dedicated to quantum science and technology.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Golden Open Access	https://journals.aps.org/prxquantum/	APS	\N	\N	Springer	\N	standard	2020
37	16	MNRAS	Monthly Notices of the Royal Astronomical Society	00358711	13652966	Observational astronomy, theoretical astrophysics, celestial mechanics	One of the world's primary astronomy research journals.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://academic.oup.com/mnras	Oxford University Press	\N	\N	Springer	\N	standard	1827
38	18	NAT-CLIM	Nature Climate Change	1758678X	17586798	Global warming, climate policy, mitigation, ecological impacts	Dedicated to understanding climate change and its socio-economic impacts.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://www.nature.com/nclimate/	Nature Portfolio	\N	\N	Springer	\N	standard	2011
39	18	GCB	Global Change Biology	13541013	13652486	Biological response to environmental change, biodiversity, carbon cycle	Focuses on the interface between biological systems and climate change.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://onlinelibrary.wiley.com/journal/13652486	Wiley-Blackwell	\N	\N	Springer	\N	standard	1995
40	18	ES&T	Environmental Science & Technology	0013936X	15205851	Environmental chemistry, pollution control, eco-toxicology, sustainability	Comprehensive coverage of environmental science research.	2026-09-28 23:19:55.284	2026-09-28 23:19:55.284	Journal	Hybrid	https://pubs.acs.org/journal/esthag	ACS Publications	\N	\N	Springer	\N	standard	1967
47	5	MLJ	Machine Learning Journal test 002	99990001	99990002	Machine learning, deep learning, statistical learning theory	Publishes research on all aspects of machine learning.	2026-09-29 19:32:10.916	2026-09-29 19:32:10.916	Journal	Golden Open Access	https://link.springer.com/journal/10994-test2	Springer Nature	\N	\N	Springer	\N	standard	1986
\.


--
-- Data for Name: academicResearchers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."academicResearchers" (id, "firstName", "lastName", "institutionName", department, affiliation, "mainTopic", subtopics, "scholarId", "linkedinUrl", "createdAt", "updatedAt") FROM stdin;
1	Yann	LeCun	New York University	Computer Science	Meta AI	Deep Learning	["convolutional neural networks", "self-supervised learning", "energy-based models"]	WLN3grAAAAAJ	https://www.linkedin.com/in/yann-lecun	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
2	Geoffrey	Hinton	University of Toronto	Computer Science	Vector Institute	Machine Learning	["neural networks", "backpropagation", "capsule networks"]	JicYPdAAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
3	Yoshua	Bengio	Université de Montréal	Computer Science	Mila	Deep Learning	["attention mechanisms", "generative models", "AI safety"]	kukA0LcAAAAJ	https://www.linkedin.com/in/yoshua-bengio-3709064	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
4	Fei-Fei	Li	Stanford University	Computer Science	Stanford AI Lab	Computer Vision	["image recognition", "visual intelligence", "human-centered AI"]	rDWWQFcAAAAJ	https://www.linkedin.com/in/fei-fei-li-4541247	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
5	Andrew	Ng	Stanford University	Computer Science	DeepLearning.AI	Machine Learning	["deep learning education", "AI transformation", "natural language processing"]	mG4imMEAAAAJ	https://www.linkedin.com/in/andrewyng	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
6	Daphne	Koller	Stanford University	Computer Science	insitro	Probabilistic Graphical Models	["computational biology", "drug discovery", "causal inference"]	JtSG910AAAAJ	https://www.linkedin.com/in/daphne-koller	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
7	Judea	Pearl	University of California, Los Angeles	Computer Science	\N	Causal Inference	["causal calculus", "structural equation models", "bayesian networks"]	0oeSGrEAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
8	Leslie	Valiant	Harvard University	Computer Science	\N	Computational Learning Theory	["PAC learning", "evolution algorithms", "parallel computing"]	1fZFqqAAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
9	Michael	Jordan	University of California, Berkeley	Electrical Engineering and Computer Science	\N	Statistical Machine Learning	["variational inference", "graphical models", "optimization"]	yxUduqMAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
10	Cynthia	Dwork	Harvard University	Computer Science	\N	Algorithmic Fairness	["differential privacy", "fairness in ML", "algorithmic stability"]	y2HuiYAAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
11	Kunle	Olukotun	Stanford University	Electrical Engineering	SambaNova Systems	Computer Architecture	["parallel programming", "domain-specific accelerators", "multi-core processors"]	9mjX6zkAAAAJ	https://www.linkedin.com/in/kunle-olukotun	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
12	Barbara	Liskov	Massachusetts Institute of Technology	Electrical Engineering and Computer Science	\N	Programming Languages	["distributed computing", "fault tolerance", "data abstraction"]	nTAPI-4AAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
13	Donald	Knuth	Stanford University	Computer Science	\N	Algorithm Analysis	["analysis of algorithms", "combinatorial algorithms", "tex typesetting"]	CdyCiM0AAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
14	Tim	Berners-Lee	Massachusetts Institute of Technology	Computer Science	World Wide Web Consortium	Web Technologies	["semantic web", "linked data", "decentralized web"]	Ky1F2UYAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
15	Jeff	Dean	Google	Google Research	\N	Large-Scale ML Systems	["distributed systems", "tensorflow", "sparsely-gated mixture of experts"]	N9MsD28AAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
16	Anima	Anandkumar	California Institute of Technology	Computing and Mathematical Sciences	NVIDIA	Tensor Methods	["tensor decompositions", "neural operator learning", "scientific machine learning"]	0JQsAoYAAAAJ	https://www.linkedin.com/in/anima-anandkumar-84109517	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
17	Kate	Crawford	University of Southern California	Annenberg School	Microsoft Research	AI Ethics	["social implications of AI", "data politics", "critical algorithm studies"]	9aMxovUAAAAJ	https://www.linkedin.com/in/kate-crawford	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
18	Ruslan	Salakhutdinov	Carnegie Mellon University	Machine Learning Department	\N	Deep Generative Models	["probabilistic graphical models", "unsupervised learning", "reinforcement learning"]	ITZ1e7MAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
19	Ilya	Sutskever	OpenAI	Research	\N	Deep Learning	["sequence to sequence learning", "large language models", "AI alignment"]	x04W_mIAAAAJ	\N	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
20	Doina	Precup	McGill University	Computer Science	DeepMind	Reinforcement Learning	["hierarchical reinforcement learning", "temporal abstraction", "off-policy evaluation"]	q-Bhoj8AAAAJ	https://www.linkedin.com/in/doina-precup	2026-09-27 22:38:53.321	2026-09-27 22:38:53.321
22	firstNametest	testtest	Université de test	Computer Science test	\N	Deep Learning test	\N	\N	\N	2026-09-29 19:06:09.885	2026-09-29 19:06:09.885
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt", issuer) FROM stdin;
pG3CcvGQPo8RwCctfZ9iX1QJ03oezlf5	mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l	credential	mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l	\N	\N	\N	\N	\N	\N	de27ee5aa6be2626c46e534499949104:10fb310e697a846041a67b1017a16c29124745bd86342cf9fb6ff470f48f46b70cc189bfbaedc4b575a5aff15494abbf2e568a288dceaedab3cbe2e7ebaa7983	2026-09-28 21:30:50.042	2026-09-28 21:30:50.042	local:credential
qxkfEyyCHszt56GWOe8tpoWiNvfWNPZm	gAENj0NZRkVM1kQ9H9fntTKyQAmKmOcD	credential	gAENj0NZRkVM1kQ9H9fntTKyQAmKmOcD	\N	\N	\N	\N	\N	\N	d0a209d058e88a704eb4f4408aa22871:94ae06b15ff54c484ad6043d290d3321861492f014559471ebd2ac284bf6049a2d5a242d87920265c71caf45f26284889901213fd9d1fd5c7e714d8d045ba2a0	2026-09-29 15:19:14.841	2026-09-29 15:19:14.841	local:credential
vIGoDDyuZehrwvmBTotwwvD6FIyan3Uk	NBoVTa6nsWGplCUTTSshToz7eUGrHjMw	credential	NBoVTa6nsWGplCUTTSshToz7eUGrHjMw	\N	\N	\N	\N	\N	\N	4f90b33a77bcbc04e6df4fbc9231681a:5b5586cd29b6e596fdc734f0d5888575fe8947ec4868fd599f3ae865b6a5a2bc3a5213f28b2dbe7c35ec85e70b7382de9fd52874a8ef34cdb7502791f8c5ef6c	2026-09-29 15:25:57.386	2026-09-29 15:25:57.386	local:credential
OBFNrYFafXyyasmH3Zgh2icQIilB84jU	6eCbO0ziWUCBqAd7Cx0s83g7ZvhT4Pn7	credential	6eCbO0ziWUCBqAd7Cx0s83g7ZvhT4Pn7	\N	\N	\N	\N	\N	\N	c521ce9b10a98cf66a9e3810cf597708:5815906a84dbce7201ce0150baec66b73f7caf94e5e904a4e5cf733255478a04dedd08912df61e5e6d43a6b0f16378a4f4ddca23067dd3979791a12683a8706d	2026-10-14 16:25:03.465	2026-10-14 16:25:03.465	local:credential
sJsQunGbBzA9Cwt6S0Sa8vRWHWdzO4Pq	foUCI1uG4z0qiRjBk6Qt9rBQj50Ph5s9	credential	foUCI1uG4z0qiRjBk6Qt9rBQj50Ph5s9	\N	\N	\N	\N	\N	\N	b0bffe0a2af0802d4641c8795da33146:c163f7ecb87b7b8f65d5f4d1409b367e35d42461279b521d1cfb949f8771b0f37cd4ee4416d43bdf7742f73138d8871a713db03f6d59910807d647c51f3efec4	2026-10-14 16:28:54.494	2026-10-14 16:28:54.494	local:credential
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.companies (id, name, industry, size, website, linkedin, glassdoor, "headquartersCountry", "createdAt", "updatedAt") FROM stdin;
1	STMicroelectronics (ST)	Multinational (Design & R&D)	10,001+	https://www.st.com	https://linkedin.com/company/stmicroelectronics	https://glassdoor.com/Overview/STMicroelectronics	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
2	MediaTek	Multinational (Design & R&D)	10,001+	https://www.mediatek.com	https://linkedin.com/company/mediatek	https://glassdoor.com/Overview/MediaTek	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
3	Analog Devices (ADI)	Multinational (Design & R&D)	10,001+	https://www.analog.com	https://linkedin.com/company/analog-devices	https://glassdoor.com/Overview/Analog-Devices	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
4	Siemens EDA	EDA & Semiconductor Software	5,001-10,000	https://eda.sw.siemens.com	https://linkedin.com/company/siemens-eda	https://glassdoor.com/Overview/Siemens-EDA	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
5	Synopsys	EDA & Semiconductor Software	10,001+	https://www.synopsys.com	https://linkedin.com/company/synopsys-inc	https://glassdoor.com/Overview/Synopsys	United States	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
6	Cadence Design Systems	EDA & Hardware Description	5,001-10,000	https://www.cadence.com	https://linkedin.com/company/cadence-design-systems	https://glassdoor.com/Overview/Cadence-Design-Systems	United States	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
7	Ineda Systems	Embedded Systems & IoT	51-200	https://www.inedasystems.com	https://linkedin.com/company/ineda-systems	\N	India	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
8	Valence Semiconductor	ASIC & Mixed-Signal ICs	201-500	https://www.valencesemi.com	https://linkedin.com/company/valence-semi	\N	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
9	Microchip Technology	Microcontrollers & Touch Solutions	10,001+	https://www.microchip.com	https://linkedin.com/company/microchip-technology	https://glassdoor.com/Overview/Microchip-Technology	United States	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
10	Si-Ware Systems	Optical MEMS & Spectral Sensing	201-500	https://www.si-ware.com	https://linkedin.com/company/si-ware-systems	https://glassdoor.com/Overview/Si-Ware-Systems	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
11	Arm Ltd.	IP Licensing & CPU Architecture	5,001-10,000	https://www.arm.com	https://linkedin.com/company/arm	https://glassdoor.com/Overview/Arm	United Kingdom	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
12	NXP Semiconductors	Automotive & Secure Connections	10,001+	https://www.nxp.com	https://linkedin.com/company/nxp-semiconductors	https://glassdoor.com/Overview/NXP-Semiconductors	Netherlands	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
13	Texas Instruments	Analog & Embedded Processing	10,001+	https://www.ti.com	https://linkedin.com/company/texas-instruments	https://glassdoor.com/Overview/Texas-Instruments	United States	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
14	Infineon Technologies	Automotive & Power Management	10,001+	https://www.infineon.com	https://linkedin.com/company/infineon-technologies	https://glassdoor.com/Overview/Infineon-Technologies	Germany	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
15	Broadcom Inc.	Infrastructure & Wireless Solutions	10,001+	https://www.broadcom.com	https://linkedin.com/company/broadcom	https://glassdoor.com/Overview/Broadcom	United States	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
16	Renesas Electronics	Embedded Processors & Microcontrollers	10,001+	https://www.renesas.com	https://linkedin.com/company/renesas	https://glassdoor.com/Overview/Renesas-Electronics	Japan	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
17	Nordic Semiconductor	Ultra-Low Power Wireless	1,001-5,000	https://www.nordicsemi.com	https://linkedin.com/company/nordic-semiconductor	https://glassdoor.com/Overview/Nordic-Semiconductor	Norway	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
18	Realtek Semiconductor	Communications & Multimedia ICs	5,001-10,000	https://www.realtek.com	https://linkedin.com/company/realtek	\N	Taiwan	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
19	Brightskies	Automotive Software & Embedded Systems	501-1,000	https://www.brightskiesinc.com	https://linkedin.com/company/brightskies	https://glassdoor.com/Overview/Brightskies	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
20	Swift Act	Embedded Systems & Software Services	51-200	https://www.swiftact.com	https://linkedin.com/company/swift-act	\N	Egypt	2026-09-29 18:35:30.252	2026-09-29 18:35:30.252
\.


--
-- Data for Name: companyBranches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."companyBranches" (id, "companyId", region, country, state, city, presence) FROM stdin;
1	1	MENA	EG	Cairo Governorate	Cairo	\N
2	2	MENA	EG	Giza Governorate	Smart Village	\N
3	3	MENA	EG	Cairo Governorate	New Cairo	\N
4	4	MENA	EG	Giza Governorate	6th of October	\N
5	5	Europe	DE	Bavaria	Munich	\N
6	6	North America	US	California	San Jose	\N
7	7	MENA	EG	Alexandria Governorate	Alexandria	\N
8	1	Europe	FR	Île-de-France	Paris	\N
9	2	Asia-Pacific	TW	Hsinchu	Hsinchu Science Park	\N
10	3	North America	US	Texas	Austin	\N
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.departments (id, name, "shortName", website, description, "facultyId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faculties (id, name, "shortName", website, description, "universityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.feedbacks (id, "userId", "firstName", "lastName", email, category, message, "submittedAt") FROM stdin;
\.


--
-- Data for Name: graduationProjectApplications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."graduationProjectApplications" (id, "projectId", "applicantUserId", "teamMembers", "proposalSummaryUrl", status, "submittedAt") FROM stdin;
\.


--
-- Data for Name: graduationProjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."graduationProjects" (id, "isSponsored", "sponsorCompanyId", university, faculty, industry, domains, supervisor, "coSupervisor", "projectTitle", "noOfStudents", "documentationLink", "postedAt") FROM stdin;
1	f	\N	Cairo University	Faculty of Engineering	Software Engineering	["Machine Learning", "Healthcare"]	Dr. Ahmed Hassan	Eng. Sara Mahmoud	AI-Based Diagnostic Tool for Diabetic Retinopathy	4	https://github.com/example/retinopathy-ai	2026-09-28 23:41:34.953
2	t	\N	Ain Shams University	Faculty of Computer and Information Sciences	Cybersecurity	["Cybersecurity", "Blockchain"]	Dr. Mohamed Abdelrahman	\N	Decentralized Identity Verification System using Zero-Knowledge Proofs	3	https://github.com/example/zk-identity	2026-09-28 23:41:34.953
3	f	\N	Alexandria University	Faculty of Engineering	Robotics	["Robotics", "Embedded Systems"]	Prof. Khaled Omar	Dr. Reem El-Sayed	Autonomous Search and Rescue Drone Swarm	5	https://github.com/example/drone-swarm	2026-09-28 23:41:34.953
4	f	\N	German University in Cairo	Faculty of Information Technology	Cloud Computing	["DevOps", "Distributed Systems"]	Dr. Tarek Ibrahim	\N	Serverless Multi-Cloud Deployment Orchestrator	3	https://github.com/example/multi-cloud-orchestrator	2026-09-28 23:41:34.953
5	t	\N	American University in Cairo	School of Sciences and Engineering	FinTech	["Machine Learning", "Finance"]	Prof. Hoda Mostafa	Dr. Amr Zaki	Real-Time Fraud Detection System using Graph Neural Networks	4	https://github.com/example/gnn-fraud-detection	2026-09-28 23:41:34.953
6	f	\N	Helwan University	Faculty of Computers and Artificial Intelligence	Computer Vision	["Deep Learning", "Autonomous Vehicles"]	Dr. Mona Youssef	\N	Edge-Based Driver Fatigue and Distraction Detection System	4	https://github.com/example/driver-fatigue-edge	2026-09-28 23:41:34.953
7	f	\N	Mansoura University	Faculty of Engineering	Internet of Things	["IoT", "Smart Agriculture"]	Dr. Eslam Farag	Eng. Nada Ali	Automated Hydroponics Greenhouse Control and Monitoring Platform	5	https://github.com/example/smart-hydroponics	2026-09-28 23:41:34.953
8	t	\N	Nile University	School of Information Technology and Computer Science	Natural Language Processing	["NLP", "AI"]	Prof. Sherif Radwan	\N	Arabic Medical Dialect Chatbot for Triage and Telehealth	3	https://github.com/example/arabic-med-chatbot	2026-09-28 23:41:34.953
9	f	\N	Assiut University	Faculty of Engineering	Renewable Energy	["Clean Energy", "Smart Grid"]	Dr. Mahmoud Soliman	Dr. Heba Gamal	AI-Powered Solar Panel Micro-Cracks Detection and Grid Prediction	4	https://github.com/example/solar-defect-prediction	2026-09-28 23:41:34.953
10	f	\N	Zagazig University	Faculty of Computers and Informatics	Data Analytics	["Big Data", "Supply Chain"]	Dr. Yasser Fathy	\N	Predictive Analytics for Urban Supply Chain Optimization	3	https://github.com/example/supply-chain-analytics	2026-09-28 23:41:34.953
11	t	\N	Cairo University	Faculty of Engineering	Telecommunications	["5G", "Signal Processing"]	Prof. Gamal El-Sawi	Dr. Fatma Salem	Massive MIMO Beamforming Optimization via Deep Reinforcement Learning	4	https://github.com/example/mimo-beamforming-rl	2026-09-28 23:41:34.953
12	f	\N	Ain Shams University	Faculty of Engineering	Biomedical Engineering	["Medical Devices", "DSP"]	Dr. Rania Hamdy	\N	Wearable EEG Signal Classification for Epilepsy Seizure Early Warning	4	https://github.com/example/eeg-seizure-warning	2026-09-28 23:41:34.953
13	f	\N	Benha University	Faculty of Computers and Artificial Intelligence	Extended Reality	["AR/VR", "Education"]	Dr. Walid Nabil	Eng. Nouran Karem	Augmented Reality Laboratory Simulator for Chemistry Experiments	3	https://github.com/example/ar-chem-lab	2026-09-28 23:41:34.953
14	t	\N	German University in Cairo	Faculty of Engineering Sciences	Automotive	["Embedded Systems", "CAN Bus"]	Dr. Karim Sobhy	\N	Over-The-Air (OTA) Secure Firmware Update Engine for Automotive ECUs	4	https://github.com/example/automotive-ota-ecu	2026-09-28 23:41:34.953
15	f	\N	Suez Canal University	Faculty of Computers and Informatics	Information Security	["Cryptography", "Network Security"]	Dr. Sameh Amer	Dr. Dina Reda	Quantum-Resistant Lattice-Based VPN Tunneling Protocol	3	https://github.com/example/pqc-vpn-protocol	2026-09-28 23:41:34.953
16	f	\N	Tanta University	Faculty of Engineering	Smart Cities	["Computer Vision", "Traffic Management"]	Dr. Osama Tawfik	\N	Dynamic Traffic Light Signals Control based on Emergency Vehicle Detection	5	https://github.com/example/smart-traffic-control	2026-09-28 23:41:34.953
17	t	\N	Menofia University	Faculty of Electronic Engineering	VLSI & Microelectronics	["Hardware Design", "RISC-V"]	Prof. Magdy El-Ghannam	Dr. Hisham Badr	Design and FPGA Implementation of a Low-Power RISC-V Neural Accelerator	4	https://github.com/example/riscv-neural-accel	2026-09-28 23:41:34.953
18	f	\N	British University in Egypt	Faculty of Informatics and Computer Science	Software Engineering	["Microservices", "Testing"]	Dr. Dina El-Dakhakhny	\N	Automated Chaos Testing Framework for Cloud-Native Microservices	3	https://github.com/example/chaos-testing-engine	2026-09-28 23:41:34.953
19	f	\N	South Valley University	Faculty of Computers and Information	Geographic Information Systems	["Remote Sensing", "GIS"]	Dr. Alaa Qutb	Eng. Mai Samir	Satellite Imagery Analysis for Illegal Building Detection on Agricultural Land	4	https://github.com/example/satellite-encroachment-detection	2026-09-28 23:41:34.953
20	t	\N	Arab Academy for Science, Technology and Maritime Transport	College of Computing and Information Technology	Logistics	["Autonomous Systems", "Computer Vision"]	Prof. Hazem Said	\N	Automated Robotic Sorting and Inventory System for Warehouses	5	https://github.com/example/warehouse-sorting-robot	2026-09-28 23:41:34.953
\.


--
-- Data for Name: jobApplications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."jobApplications" (id, "jobId", "applicantUserId", "cvPath", status, "submittedAt") FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, "companyId", "branchId", title, industry, domains, type, seniority, description, requirements, salary, "applyLink", "postedAt", "updatedAt") FROM stdin;
21	1	1	Maintenance Engineer @Siemens Mobility Egypt	Automation, Machinery, Manufacturing	["Automation", "PLC", "SCADA"]	fullTime	mid	Oversee equipment maintenance and site operations.	BSc in Electrical/Mechanical Engineering, 3+ years experience.	$1,500 - $2,500 / month	https://careers.siemens.com/job/101	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
22	2	1	Semiconductors Digital Verification Engineer	Engineering	["UVM", "SystemVerilog", "Verilog"]	fullTime	junior	Develop test benches for semiconductor digital verification.	Knowledge of SystemVerilog/UVM, basic ASIC/FPGA flow.	$1,200 - $1,800 / month	https://capgemini.com/jobs/202	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
23	3	1	ASIC Verification Engineer	Software, Development	["ASIC", "SystemVerilog", "PCIe"]	fullTime	mid	Verify high-speed interconnect and network processor chips.	3+ years in ASIC Verification, UVM methodology expertise.	$2,500 - $3,500 / month	https://cisco.com/jobs/303	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
24	4	1	Senior Devops Engineer & Infrastructure Specialist	Cloud & DevOps	["Docker", "Kubernetes", "AWS"]	fullTime	senior	Manage CI/CD pipelines, cloud deployment, and infrastructure security.	5+ years experience in DevOps, Linux administration, AWS/GCP.	$3,500 - $5,000 / month	https://vodafone.com/jobs/404	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
25	5	1	Embedded Software Control Systems Engineer	Automotive	["AUTOSAR", "C++", "Embedded C"]	fullTime	mid	Design and implement embedded software controls for automotive systems.	Degree in Computer/Mechatronics Engineering, C/C++ skills.	$2,000 - $3,000 / month	https://valeo.com/jobs/505	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
26	6	1	Site Reliability & DevOps Infrastructure Lead	Cloud & DevOps	["Kubernetes", "Terraform", "Prometheus"]	fullTime	lead	Lead the SRE team to deliver 99.99% uptime across production clusters.	7+ years SRE experience, expertise in Terraform and monitoring.	$4,500 - $6,500 / month	https://dell.com/jobs/606	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
27	7	2	Analog IC Design Engineer	Semiconductors	["Cadence", "SPICE", "CMOS"]	fullTime	senior	Design low-power analog circuits and power management ICs.	5+ years in CMOS analog circuit design.	$4,000 - $5,500 / month	https://st.com/jobs/707	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
28	8	2	Embedded Firmware Engineer	Embedded Systems	["ARM Cortex", "RTOS", "C"]	fullTime	junior	Develop bare-metal and RTOS firmware for ARM Cortex microcontrollers.	Strong C programming, microcontrollers, communication protocols (SPI, I2C).	$1,000 - $1,600 / month	https://mediatek.com/jobs/808	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
29	9	2	FPGA Prototyping Engineer	Hardware	["Vivado", "Verilog", "Xilinx"]	fullTime	mid	Build FPGA prototypes for complex SoC verification.	Experience with Xilinx/Intel FPGAs, timing closure, logic analyzers.	$2,200 - $3,200 / month	https://synopsys.com/jobs/909	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
30	10	3	VLSI Physical Design Engineer	Semiconductors	["Innovus", "Floorplanning", "STA"]	fullTime	senior	Perform synthesis, floorplanning, placement, routing, and STA.	5+ years experience with Synopsys/Cadence physical design tools.	$4,200 - $6,000 / month	https://cadence.com/jobs/1010	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
31	11	3	Embedded Systems Software Intern	Embedded Systems	["C", "Linux", "Raspberry Pi"]	internship	junior	Assist in implementing driver modules for Linux embedded devices.	Undergraduate student in Computer Engineering or related field.	$500 - $800 / month	https://brightskies.com/jobs/1111	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
32	12	3	AI/ML Edge Hardware Accelerator Engineer	Artificial Intelligence	["PyTorch", "CUDA", "TensorRT"]	fullTime	mid	Optimize AI models for edge hardware deployment and NPU integration.	MSc/BSc in AI or CS, proficiency in C++ and Python.	$3,000 - $4,500 / month	https://arm.com/jobs/1212	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
33	13	4	Automotive SW Integration Engineer	Automotive	["CAN", "LIN", "Vector CANoe"]	fullTime	mid	Integrate software modules for ECU controllers.	Experience with Vector tools (CANoe, CANalyzer) and automotive networks.	$2,100 - $3,100 / month	https://nxp.com/jobs/1313	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
34	14	4	DSP Engineer - Audio Signal Processing	Signal Processing	["MATLAB", "C++", "DSP"]	fullTime	senior	Develop audio enhancement algorithms on dedicated DSP processors.	Strong math background, MATLAB prototyping, and embedded C++ DSP programming.	$3,800 - $5,200 / month	https://ti.com/jobs/1414	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
35	15	5	Cybersecurity Engineer - Embedded Security	Security	["Cryptographic Chips", "HSM", "TrustZone"]	fullTime	mid	Implement secure boot, cryptographic hardware interfaces, and hardware security.	Experience with ARM TrustZone, TPMs, and secure coding standards.	$2,800 - $4,000 / month	https://infineon.com/jobs/1515	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
36	16	5	RF / Microwave Hardware Engineer	Telecommunications	["ADS", "HFSS", "PCB Design"]	fullTime	senior	Design high-frequency RF boards and antenna matching circuits.	5+ years in RF system design, spectrum analyzers, and RF simulation.	$4,000 - $5,800 / month	https://broadcom.com/jobs/1616	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
37	17	6	BLE / Wireless Embedded Software Developer	Wireless & IoT	["Nordic SDK", "BLE", "Zigbee"]	partTime	mid	Implement ultra-low power Bluetooth Low Energy protocols.	Experience with Nordic nRF52/nRF53 ICs and BLE stack configuration.	$1,800 - $2,600 / month	https://nordicsemi.com/jobs/1717	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
38	18	6	RTL Design Engineer	Semiconductors	["SystemVerilog", "Chisel", "ASIC"]	fullTime	junior	Implement digital logic blocks for next-gen microcontrollers.	Strong digital logic fundamentals, SystemVerilog synthesis.	$1,400 - $2,000 / month	https://realtek.com/jobs/1818	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
39	19	7	System Architecture Director	Executive & Management	["SoC", "RISC-V", "ARM"]	fullTime	lead	Lead system architecture definition for multi-core SoC platforms.	10+ years in semiconductor design and technical leadership.	$8,000 - $12,000 / month	https://renesas.com/jobs/1919	2026-09-29 20:02:03.675	2026-09-29 20:02:03.675
40	1	1	Maintenance Engineer @Siemens Mobility Egypt	Automation, Machinery, Manufacturing	["Automation", "PLC", "SCADA"]	fullTime	mid	Oversee equipment maintenance and site operations.	BSc in Electrical/Mechanical Engineering, 3+ years experience.	$1,500 - $2,500 / month	https://careers.siemens.com/job/101	2026-09-29 20:02:03.675	2026-09-29 18:35:44.554
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles ("userId", "firstName", "lastName", gender, country, governorate, university, faculty, department, "graduationYear", "linkedinUrl", "githubUrl", "scholarUrl", skills, experience) FROM stdin;
AqFsIwICYzbKFzs09rIbH0OLGQ9woHG8	Ahmed	Mohamed	Male	Egypt	Cairo	Cairo University	Faculty of Engineering	Computer Engineering	2025	https://linkedin.com/in/ahmed-mohamed	https://github.com/ahmed-mohamed	https://scholar.google.com/citations?user=ahmed	["C++", "Python", "Machine Learning", "SQL"]	[{"role": "Software Engineering Intern", "company": "Google", "duration": "3 months", "description": "Developed backend APIs and optimized database queries."}]
mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l	Omar	Hassan	Male	Egypt	Giza	Ain Shams University	Faculty of Engineering	Computer and Systems Engineering	2026	https://linkedin.com/in/omar-hassan	https://github.com/omar-hassan	\N	["C#", ".NET", "ASP.NET Core", "PostgreSQL"]	[{"role": "Backend Developer Intern", "company": "Ejada", "duration": "2 months", "description": "Built REST APIs using ASP.NET Core."}]
gAENj0NZRkVM1kQ9H9fntTKyQAmKmOcD	femaleFirstName	femaleLastName	Female	Egypt	Giza	Ain Shams University	Faculty of Engineering	Computer and Systems Engineering	2026	https://linkedin.com/in/omar-hassan	https://github.com/omar-hassan	\N	["C#", ".NET", "ASP.NET Core", "PostgreSQL"]	[{"role": "Backend Developer Intern", "company": "Ejada", "duration": "2 months", "description": "Built REST APIs using ASP.NET Core."}]
NBoVTa6nsWGplCUTTSshToz7eUGrHjMw	maleFirstName	maleLastName	Male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: publicationDomains; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."publicationDomains" (id, name) FROM stdin;
1	Computer Science
2	Medicine & Life Sciences
3	Engineering & Technology
4	Physics & Astronomy
5	Environmental & Earth Sciences
\.


--
-- Data for Name: publicationSubcategories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."publicationSubcategories" (id, "domainId", name) FROM stdin;
5	1	Machine Learning
6	1	Computer Vision
7	1	Natural Language Processing
8	1	Software Engineering
9	1	Cybersecurity
10	2	Oncology
11	2	Neuroscience
12	2	Genomics
13	3	Robotics & Control Systems
14	3	Electrical Engineering
15	3	Biomedical Engineering
16	4	Astrophysics
17	4	Quantum Physics
18	5	Climate Change & Sustainability
\.


--
-- Data for Name: publicationYearlyMetrics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."publicationYearlyMetrics" (id, "publicationId", "metricYear", jci, eigenfactor, "articleInfluenceScore", citescore, "updatedAt", "createdAt", "indexingService", quartile, "articleDownloads", "h5Index", "impactFactor", "impactFactor5yr", sjr, "totalCitations") FROM stdin;
\.


--
-- Data for Name: researchPapers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."researchPapers" (id, "putCode", "orcidPath", title, subtitle, type, "journalTitle", doi, url, "publicationYear", "publicationMonth", "publicationDay", "sourceName", visibility, "staffId", "createdAt", "updatedAt") FROM stdin;
25	1001	0000-0002-1825-0097	Attention Is All You Need	\N	journal-article	Advances in Neural Information Processing Systems	10.48550/arXiv.1706.03762	https://arxiv.org/abs/1706.03762	2017	6	12	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
26	1002	0000-0001-5000-0001	Deep Residual Learning for Image Recognition	\N	conference-paper	IEEE Conference on Computer Vision and Pattern Recognition	10.1109/CVPR.2016.90	https://arxiv.org/abs/1512.03385	2016	6	27	IEEE	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
27	1003	0000-0002-3000-0002	BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding	\N	conference-paper	NAACL-HLT	10.48550/arXiv.1810.04805	https://arxiv.org/abs/1810.04805	2018	10	11	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
28	1004	0000-0003-4000-0003	Adam: A Method for Stochastic Optimization	\N	conference-paper	ICLR	10.48550/arXiv.1412.6980	https://arxiv.org/abs/1412.6980	2014	12	22	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
29	1005	0000-0001-2000-0004	Generative Adversarial Nets	\N	journal-article	Advances in Neural Information Processing Systems	10.48550/arXiv.1406.2661	https://arxiv.org/abs/1406.2661	2014	6	10	NIPS	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
30	1006	0000-0002-8000-0005	Mastering the Game of Go with Deep Neural Networks and Tree Search	\N	journal-article	Nature	10.1038/nature16961	https://www.nature.com/articles/nature16961	2016	1	28	Nature Publishing Group	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
31	1007	0000-0003-9000-0006	ImageNet Classification with Deep Convolutional Neural Networks	\N	journal-article	Communications of the ACM	10.1145/3065386	https://dl.acm.org/doi/10.1145/3065386	2012	12	3	ACM	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
32	1008	0000-0001-7000-0007	Dropout: A Simple Way to Prevent Neural Networks from Overfitting	\N	journal-article	Journal of Machine Learning Research	10.5555/2627435.2670313	https://jmlr.org/papers/v15/srivastava14a.html	2014	6	15	JMLR	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
33	1009	0000-0002-6000-0008	Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift	\N	conference-paper	ICML	10.48550/arXiv.1502.03167	https://arxiv.org/abs/1502.03167	2015	2	11	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
34	1010	0000-0003-1000-0009	Language Models are Few-Shot Learners	\N	journal-article	Advances in Neural Information Processing Systems	10.48550/arXiv.2005.14165	https://arxiv.org/abs/2005.14165	2020	5	28	NeurIPS	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
35	1011	0000-0001-9000-0010	U-Net: Convolutional Networks for Biomedical Image Segmentation	\N	conference-paper	MICCAI	10.1007/978-3-319-24574-4_28	https://arxiv.org/abs/1505.04597	2015	5	18	Springer	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
36	1012	0000-0002-4000-0011	YOLO: You Only Look Once: Unified, Real-Time Object Detection	\N	conference-paper	IEEE CVPR	10.1109/CVPR.2016.91	https://arxiv.org/abs/1506.02640	2016	6	9	IEEE	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
37	1013	0000-0003-5000-0012	Very Deep Convolutional Networks for Large-Scale Image Recognition	\N	conference-paper	ICLR	10.48550/arXiv.1409.1556	https://arxiv.org/abs/1409.1556	2014	9	4	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
38	1014	0000-0001-3000-0013	Long Short-Term Memory	\N	journal-article	Neural Computation	10.1162/neco.1997.9.8.1735	https://doi.org/10.1162/neco.1997.9.8.1735	1997	11	15	MIT Press	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
39	1015	0000-0002-2000-0014	Human-level control through deep reinforcement learning	\N	journal-article	Nature	10.1038/nature14236	https://www.nature.com/articles/nature14236	2015	2	26	Nature Publishing Group	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
40	1016	0000-0003-7000-0015	Neural Machine Translation by Jointly Learning to Align and Translate	\N	conference-paper	ICLR	10.48550/arXiv.1409.0473	https://arxiv.org/abs/1409.0473	2014	9	1	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
41	1017	0000-0001-1000-0016	Deep Residual Learning for Image Recognition: Extended Analysis	A Comprehensive Survey	review-article	IEEE Transactions on Pattern Analysis and Machine Intelligence	10.1109/TPAMI.2017.200001	https://ieeexplore.ieee.org/document/800001	2017	4	10	IEEE	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
42	1018	0000-0002-5000-0017	Denoising Diffusion Probabilistic Models	\N	journal-article	Advances in Neural Information Processing Systems	10.48550/arXiv.2006.11239	https://arxiv.org/abs/2006.11239	2020	6	19	NeurIPS	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
43	1019	0000-0003-8000-0018	LoRA: Low-Rank Adaptation of Large Language Models	\N	conference-paper	ICLR	10.48550/arXiv.2106.09685	https://arxiv.org/abs/2106.09685	2021	6	17	arXiv	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
44	1020	0000-0001-6000-0019	LLaMA: Open and Efficient Foundation Language Models	\N	technical-report	Meta AI Research	10.48550/arXiv.2302.13971	https://arxiv.org/abs/2302.13971	2023	2	27	Meta AI	public	1	2026-09-28 19:58:48.4	2026-09-28 19:58:48.4
45	0	/0000-0001-2345-6789	Deep Learning for Medical Image Analysis	A Comprehensive Review	JOURNAL_ARTICLE	IEEE Transactions on Medical Imaging	10.1109/TMI.2026.1234567	https://example.com/paper	2026	5	15	ORCID	public	1	2026-09-29 20:09:10.103	2026-09-29 20:09:29.809
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
jSwuZbwMNJRnlKArNw0y8kbSQxXfM82G	2026-10-05 21:30:50.062	5mMMbmCqsmrZfLuzala4IahO6Z31h5Aq	2026-09-28 21:30:50.062	2026-09-28 21:30:50.062		PostmanRuntime/7.51.1	mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l
0FUTkHkQjc3fBDWqlBDqtbKzkGHCf1qm	2026-10-05 21:33:12.988	9vmGwSDruB6cBt7DBuq3EnIeuLeQ3sgi	2026-09-28 21:33:12.988	2026-09-28 21:33:12.988		curl/8.15.0	mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l
9VOeDe3TwqujcK3EhPZTPn9rbE2pqfJr	2026-10-06 15:18:21.052	8whYHWwZvSO7yPjNKZkdwhB4cfu7sw7m	2026-09-29 15:18:21.053	2026-09-29 15:18:21.053		PostmanRuntime/7.51.1	mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l
cAkFclv74aC6Yo0aeug3fHW1cSFRXtxG	2026-10-06 15:19:14.849	FhIpPTHKbuTqYjHY2fFaJgi4BcBg7km0	2026-09-29 15:19:14.85	2026-09-29 15:19:14.85		PostmanRuntime/7.51.1	gAENj0NZRkVM1kQ9H9fntTKyQAmKmOcD
i79mrGNIBtW2droneWoc2H4EgU5Je0Ru	2026-10-07 18:47:05.174	uH7lz5djQoa9CHS5aVN7qaVBdxooFqa8	2026-09-29 15:25:57.392	2026-09-30 18:47:05.174		PostmanRuntime/7.51.1	NBoVTa6nsWGplCUTTSshToz7eUGrHjMw
fbhX84LdcemyedkKcbnXDLecIS8lmdfO	2026-10-21 16:25:03.472	q0p8OkXJVED4gwUJUIo9J6nzJJ74wVjw	2026-10-14 16:25:03.472	2026-10-14 16:25:03.472		curl/8.15.0	6eCbO0ziWUCBqAd7Cx0s83g7ZvhT4Pn7
W1te8LBgaboJhVV9hepCcpzxo7R4DKOc	2026-10-21 16:28:54.501	YxLrZpltGPYs1A7S8MF7wRw2c5WTfIiK	2026-10-14 16:28:54.501	2026-10-14 16:28:54.501		curl/8.15.0	foUCI1uG4z0qiRjBk6Qt9rBQj50Ph5s9
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, linkedin_url, team, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.universities (id, name, "shortName", website, country, city, "createdAt", "updatedAt") FROM stdin;
1	Sample University	\N	\N	\N	\N	2026-09-28 19:58:33.848	2026-09-28 19:58:33.848
\.


--
-- Data for Name: universityStaff; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."universityStaff" (id, name, email, "alternativeEmail", mobile, title, degree, "facultyId", "departmentId", "universityId", "universityProfileLink", "cvLink", "researchGateLink", "googleScholarLink", "academiaLink", "linkedInLink", "youtubeLink", "orcidLink", "scopusLink", "titleProfile", "facultyProfile", citations, "researchInterests", bio, "otherUrl", "createdAt", "updatedAt") FROM stdin;
1	Jane Doe	j.doe@university.edu	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-09-28 19:58:40.346	2026-09-28 19:58:40.346
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, role, "createdAt", "updatedAt", "emailVerified", name) FROM stdin;
AqFsIwICYzbKFzs09rIbH0OLGQ9woHG8	test@test.com	student	2026-09-28 20:52:02.299	2026-09-28 20:52:02.299	f	test
z3BN8hwh5iGBaiunrHBkBhs9rXhFfH3j	test2@test.com	student	2026-09-28 21:01:40.559	2026-09-28 21:01:40.559	f	test2
mRrMEY3NuOY96jdAHGo2e8BAreS0Xz9l	test3@test.com	student	2026-09-28 21:30:50.017	2026-09-28 21:30:50.017	f	test3
gAENj0NZRkVM1kQ9H9fntTKyQAmKmOcD	test5@test.com	student	2026-09-29 15:19:14.831	2026-09-29 15:19:14.831	f	test5
NBoVTa6nsWGplCUTTSshToz7eUGrHjMw	test6@test.com	student	2026-09-29 15:25:57.377	2026-09-29 15:25:57.377	f	test6
6eCbO0ziWUCBqAd7Cx0s83g7ZvhT4Pn7	testuser@example.com	student	2026-10-14 16:25:03.452	2026-10-14 16:25:03.452	f	Test User
foUCI1uG4z0qiRjBk6Qt9rBQj50Ph5s9	browseruser@example.com	student	2026-10-14 16:28:54.48	2026-10-14 16:28:54.48	f	Browser User
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
clIyUtjr7q5CqJy6gv8I664QLRrSdnYH	vkl4dOOVnOlR5MurGLct7w32ggTNBwKQ	{"callbackURL":"http://localhost:3000/","codeVerifier":"HxVQWqM9WqCEzZWc0KXHaPaMQ0GhzEg4s0ORiclqoAGOtPTdTWhA86YTvSc_lcRczwe_Vb2LuDVmSLjoYIgYmve1SLHsWebxL861D5q2CWQdsOyRiv_l8J6Uf8oeEeiT","expiresAt":1791995706357,"oauthState":"vkl4dOOVnOlR5MurGLct7w32ggTNBwKQ"}	2026-10-14 16:35:06.358	2026-10-14 16:25:06.359	2026-10-14 16:25:06.359
ZjS4pciSjfzC3SbEAe90XOqrIwTcmC88	2YTKCmFV5hIVokrZUlLwygMr7aRR_M-h	{"callbackURL":"http://localhost:3000/","codeVerifier":"oGuyXwK3YXPx0saORLueobtQD5tDS8ORgyTR9xTWFStrk1jOQCed-sDd83PPRoq9HaT8jX7_gs3Jm-PAF8OYVYz2pD2zhfqtdoICPMuTBi1iemxjq9OmoycPMRK3VYK-","expiresAt":1791995712880,"oauthState":"2YTKCmFV5hIVokrZUlLwygMr7aRR_M-h"}	2026-10-14 16:35:12.88	2026-10-14 16:25:12.88	2026-10-14 16:25:12.88
\.


--
-- Name: PublicationEditorialStat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PublicationEditorialStat_id_seq"', 1, false);


--
-- Name: PublicationPricing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PublicationPricing_id_seq"', 1, false);


--
-- Name: academicPublications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."academicPublications_id_seq"', 47, true);


--
-- Name: academicResearchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."academicResearchers_id_seq"', 22, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.companies_id_seq', 21, true);


--
-- Name: companyBranches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."companyBranches_id_seq"', 10, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_id_seq', 1, false);


--
-- Name: faculties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faculties_id_seq', 1, false);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.feedbacks_id_seq', 1, false);


--
-- Name: graduationProjectApplications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."graduationProjectApplications_id_seq"', 1, false);


--
-- Name: graduationProjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."graduationProjects_id_seq"', 21, true);


--
-- Name: jobApplications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."jobApplications_id_seq"', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 41, true);


--
-- Name: publicationDomains_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."publicationDomains_id_seq"', 1, false);


--
-- Name: publicationSubcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."publicationSubcategories_id_seq"', 1, false);


--
-- Name: publicationYearlyMetrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."publicationYearlyMetrics_id_seq"', 1, false);


--
-- Name: researchPapers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."researchPapers_id_seq"', 45, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.team_members_id_seq', 1, false);


--
-- Name: universities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.universities_id_seq', 1, false);


--
-- Name: universityStaff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."universityStaff_id_seq"', 1, true);


--
-- Name: PublicationEditorialStat PublicationEditorialStat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PublicationEditorialStat"
    ADD CONSTRAINT "PublicationEditorialStat_pkey" PRIMARY KEY (id);


--
-- Name: PublicationPricing PublicationPricing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PublicationPricing"
    ADD CONSTRAINT "PublicationPricing_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academicPublications academicPublications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."academicPublications"
    ADD CONSTRAINT "academicPublications_pkey" PRIMARY KEY (id);


--
-- Name: academicResearchers academicResearchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."academicResearchers"
    ADD CONSTRAINT "academicResearchers_pkey" PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: companyBranches companyBranches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."companyBranches"
    ADD CONSTRAINT "companyBranches_pkey" PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: graduationProjectApplications graduationProjectApplications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjectApplications"
    ADD CONSTRAINT "graduationProjectApplications_pkey" PRIMARY KEY (id);


--
-- Name: graduationProjects graduationProjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjects"
    ADD CONSTRAINT "graduationProjects_pkey" PRIMARY KEY (id);


--
-- Name: jobApplications jobApplications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."jobApplications"
    ADD CONSTRAINT "jobApplications_pkey" PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY ("userId");


--
-- Name: publicationDomains publicationDomains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationDomains"
    ADD CONSTRAINT "publicationDomains_pkey" PRIMARY KEY (id);


--
-- Name: publicationSubcategories publicationSubcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationSubcategories"
    ADD CONSTRAINT "publicationSubcategories_pkey" PRIMARY KEY (id);


--
-- Name: publicationYearlyMetrics publicationYearlyMetrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationYearlyMetrics"
    ADD CONSTRAINT "publicationYearlyMetrics_pkey" PRIMARY KEY (id);


--
-- Name: researchPapers researchPapers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."researchPapers"
    ADD CONSTRAINT "researchPapers_pkey" PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (id);


--
-- Name: universityStaff universityStaff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."universityStaff"
    ADD CONSTRAINT "universityStaff_pkey" PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: PublicationEditorialStat_acceptanceRate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PublicationEditorialStat_acceptanceRate_idx" ON public."PublicationEditorialStat" USING btree ("acceptanceRate" DESC);


--
-- Name: PublicationEditorialStat_submissionToAcceptance_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PublicationEditorialStat_submissionToAcceptance_idx" ON public."PublicationEditorialStat" USING btree ("submissionToAcceptance");


--
-- Name: PublicationEditorialStat_submissionToFirstDecision_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PublicationEditorialStat_submissionToFirstDecision_idx" ON public."PublicationEditorialStat" USING btree ("submissionToFirstDecision");


--
-- Name: PublicationPricing_currency_cost_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PublicationPricing_currency_cost_idx" ON public."PublicationPricing" USING btree (currency, cost);


--
-- Name: PublicationPricing_publicationId_pricingYear_currency_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PublicationPricing_publicationId_pricingYear_currency_key" ON public."PublicationPricing" USING btree ("publicationId", "pricingYear", currency);


--
-- Name: academicPublications_acronym_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academicPublications_acronym_idx" ON public."academicPublications" USING btree (acronym);


--
-- Name: academicPublications_eissn_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "academicPublications_eissn_key" ON public."academicPublications" USING btree (eissn);


--
-- Name: academicPublications_issnCdrom_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "academicPublications_issnCdrom_key" ON public."academicPublications" USING btree ("issnCdrom");


--
-- Name: academicPublications_issn_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "academicPublications_issn_key" ON public."academicPublications" USING btree (issn);


--
-- Name: academicPublications_licenseType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academicPublications_licenseType_idx" ON public."academicPublications" USING btree ("licenseType");


--
-- Name: academicPublications_openAccessType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academicPublications_openAccessType_idx" ON public."academicPublications" USING btree ("openAccessType");


--
-- Name: academicPublications_specificFocusScope_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academicPublications_specificFocusScope_idx" ON public."academicPublications" USING btree ("specificFocusScope");


--
-- Name: academicPublications_subCategoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academicPublications_subCategoryId_idx" ON public."academicPublications" USING btree ("subCategoryId");


--
-- Name: academicPublications_title_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academicPublications_title_idx" ON public."academicPublications" USING btree (title);


--
-- Name: companies_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX companies_name_key ON public.companies USING btree (name);


--
-- Name: departments_facultyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "departments_facultyId_idx" ON public.departments USING btree ("facultyId");


--
-- Name: departments_name_facultyId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "departments_name_facultyId_key" ON public.departments USING btree (name, "facultyId");


--
-- Name: departments_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX departments_name_idx ON public.departments USING btree (name);


--
-- Name: faculties_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faculties_name_idx ON public.faculties USING btree (name);


--
-- Name: faculties_name_universityId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "faculties_name_universityId_key" ON public.faculties USING btree (name, "universityId");


--
-- Name: faculties_universityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "faculties_universityId_idx" ON public.faculties USING btree ("universityId");


--
-- Name: publicationDomains_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "publicationDomains_name_key" ON public."publicationDomains" USING btree (name);


--
-- Name: publicationSubcategories_domainId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publicationSubcategories_domainId_idx" ON public."publicationSubcategories" USING btree ("domainId");


--
-- Name: publicationYearlyMetrics_metricYear_citescore_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publicationYearlyMetrics_metricYear_citescore_idx" ON public."publicationYearlyMetrics" USING btree ("metricYear", citescore DESC);


--
-- Name: publicationYearlyMetrics_metricYear_impactFactor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publicationYearlyMetrics_metricYear_impactFactor_idx" ON public."publicationYearlyMetrics" USING btree ("metricYear", "impactFactor" DESC);


--
-- Name: publicationYearlyMetrics_metricYear_quartile_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publicationYearlyMetrics_metricYear_quartile_idx" ON public."publicationYearlyMetrics" USING btree ("metricYear", quartile);


--
-- Name: publicationYearlyMetrics_metricYear_sjr_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publicationYearlyMetrics_metricYear_sjr_idx" ON public."publicationYearlyMetrics" USING btree ("metricYear", sjr DESC);


--
-- Name: publicationYearlyMetrics_publicationId_metricYear_indexingS_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "publicationYearlyMetrics_publicationId_metricYear_indexingS_key" ON public."publicationYearlyMetrics" USING btree ("publicationId", "metricYear", "indexingService");


--
-- Name: researchPapers_doi_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "researchPapers_doi_idx" ON public."researchPapers" USING btree (doi);


--
-- Name: researchPapers_putCode_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "researchPapers_putCode_idx" ON public."researchPapers" USING btree ("putCode");


--
-- Name: researchPapers_staffId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "researchPapers_staffId_idx" ON public."researchPapers" USING btree ("staffId");


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: universities_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX universities_name_idx ON public.universities USING btree (name);


--
-- Name: universities_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX universities_name_key ON public.universities USING btree (name);


--
-- Name: universities_shortName_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "universities_shortName_key" ON public.universities USING btree ("shortName");


--
-- Name: universityStaff_departmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "universityStaff_departmentId_idx" ON public."universityStaff" USING btree ("departmentId");


--
-- Name: universityStaff_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "universityStaff_email_key" ON public."universityStaff" USING btree (email);


--
-- Name: universityStaff_facultyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "universityStaff_facultyId_idx" ON public."universityStaff" USING btree ("facultyId");


--
-- Name: universityStaff_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "universityStaff_name_idx" ON public."universityStaff" USING btree (name);


--
-- Name: universityStaff_universityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "universityStaff_universityId_idx" ON public."universityStaff" USING btree ("universityId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: PublicationEditorialStat PublicationEditorialStat_publicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PublicationEditorialStat"
    ADD CONSTRAINT "PublicationEditorialStat_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES public."academicPublications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PublicationPricing PublicationPricing_publicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PublicationPricing"
    ADD CONSTRAINT "PublicationPricing_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES public."academicPublications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: academicPublications academicPublications_subCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."academicPublications"
    ADD CONSTRAINT "academicPublications_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES public."publicationSubcategories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: companyBranches companyBranches_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."companyBranches"
    ADD CONSTRAINT "companyBranches_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: departments departments_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT "departments_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: faculties faculties_universityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT "faculties_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES public.universities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: feedbacks feedbacks_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: graduationProjectApplications graduationProjectApplications_applicantUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjectApplications"
    ADD CONSTRAINT "graduationProjectApplications_applicantUserId_fkey" FOREIGN KEY ("applicantUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: graduationProjectApplications graduationProjectApplications_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjectApplications"
    ADD CONSTRAINT "graduationProjectApplications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."graduationProjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: graduationProjects graduationProjects_sponsorCompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."graduationProjects"
    ADD CONSTRAINT "graduationProjects_sponsorCompanyId_fkey" FOREIGN KEY ("sponsorCompanyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: jobApplications jobApplications_applicantUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."jobApplications"
    ADD CONSTRAINT "jobApplications_applicantUserId_fkey" FOREIGN KEY ("applicantUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobApplications jobApplications_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."jobApplications"
    ADD CONSTRAINT "jobApplications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."companyBranches"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: profiles profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publicationSubcategories publicationSubcategories_domainId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationSubcategories"
    ADD CONSTRAINT "publicationSubcategories_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES public."publicationDomains"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publicationYearlyMetrics publicationYearlyMetrics_publicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."publicationYearlyMetrics"
    ADD CONSTRAINT "publicationYearlyMetrics_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES public."academicPublications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: researchPapers researchPapers_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."researchPapers"
    ADD CONSTRAINT "researchPapers_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."universityStaff"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: universityStaff universityStaff_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."universityStaff"
    ADD CONSTRAINT "universityStaff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: universityStaff universityStaff_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."universityStaff"
    ADD CONSTRAINT "universityStaff_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: universityStaff universityStaff_universityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."universityStaff"
    ADD CONSTRAINT "universityStaff_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES public.universities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

