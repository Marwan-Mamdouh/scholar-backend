/**
 * Development seed for the publication catalogue.
 *
 * Journal names are real, but every ISSN, price, metric and editorial duration
 * below is SYNTHETIC — invented for local development. Do not treat any number
 * here as a real impact factor, CiteScore, article fee or review time.
 *
 *   npm run db:seed            # insert / refresh the mock catalogue
 *   npm run db:seed -- --clear # remove it again
 *
 * Safe to re-run: domains, subcategories and publications are matched on their
 * natural keys, and each publication's metrics, pricings and editorial stats are
 * replaced wholesale.
 */
import { db } from "../db_config.js";
import type {
	LicenseType,
	PublicationAccessType,
	PublicationIndex,
	PublicationType,
	Publisher,
	Quartile,
	SubBucket,
	Workflow,
} from "@prisma/client";

interface MetricSeed {
	metricYear: number;
	indexingService?: PublicationIndex;
	impactFactor?: number;
	impactFactor5yr?: number;
	quartile?: Quartile;
	jci?: number;
	sjr?: number;
	h5Index?: number;
	citescore?: number;
	totalCitations: number;
	articleDownloads: number;
}

interface PricingSeed {
	pricingYear: number;
	currency: string;
	cost: number;
	isSubscription?: boolean;
}

/** Durations are stored in **days**; the UI converts them to weeks. */
interface EditorialSeed {
	submissionToFirstDecision?: number;
	submissionToReviewDecision?: number;
	submissionToAcceptance?: number;
	acceptanceToPublication?: number;
	acceptanceRate?: number;
}

interface PublicationSeed {
	domain: string;
	subCategory: string;
	title: string;
	acronym?: string;
	publisher: Publisher;
	publicationType: PublicationType;
	openAccessType: PublicationAccessType;
	workflow: Workflow;
	licenseType?: LicenseType;
	subBucket?: SubBucket;
	issn?: string;
	eissn?: string;
	issnCdrom?: string;
	URL?: string;
	yearLunched?: number;
	imprint?: string;
	specificFocusScope?: string;
	metrics: MetricSeed[];
	pricings: PricingSeed[];
	editorial?: EditorialSeed;
}

const PUBLICATIONS: PublicationSeed[] = [
	{
		domain: "Electrical Engineering",
		subCategory: "Circuits & Systems",
		title: "IEEE Transactions on Circuits and Systems I: Regular Papers",
		acronym: "TCAS-I",
		publisher: "IEEE",
		publicationType: "Transaction",
		openAccessType: "Hybrid",
		workflow: "standard",
		licenseType: "CC_BY",
		subBucket: "CoreHybridProprietaryEnglish",
		issn: "90000001",
		eissn: "90100001",
		URL: "https://ieee-cas.org/publication/tcas-1",
		yearLunched: 1954,
		specificFocusScope:
			"Analog, digital and mixed-signal circuit theory, design and applications.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 5.2,
				impactFactor5yr: 4.9,
				quartile: "Q1",
				jci: 1.32,
				sjr: 1.42,
				h5Index: 71,
				citescore: 10.1,
				totalCitations: 41230,
				articleDownloads: 512000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "USD", cost: 2195 }],
		editorial: {
			submissionToFirstDecision: 21,
			submissionToReviewDecision: 35,
			submissionToAcceptance: 84,
			acceptanceToPublication: 14,
			acceptanceRate: 24.5,
		},
	},
	{
		domain: "Electrical Engineering",
		subCategory: "Circuits & Systems",
		title: "Microelectronics Journal",
		publisher: "ElSevier",
		publicationType: "Journal",
		openAccessType: "Subscriber_Based_Access",
		workflow: "standard",
		issn: "90000002",
		// No URL, acronym, metrics, pricing or editorial stats — exercises the
		// empty-cell rendering across every column.
		metrics: [],
		pricings: [],
	},
	{
		domain: "Electrical Engineering",
		subCategory: "Power Electronics",
		title: "IEEE Transactions on Power Electronics",
		acronym: "TPEL",
		publisher: "IEEE",
		publicationType: "Transaction",
		openAccessType: "Subscriber_Based_Access",
		workflow: "standard",
		subBucket: "TLSubscription",
		issn: "90000003",
		eissn: "90100003",
		URL: "https://www.ieee-pels.org/publications/tpel",
		yearLunched: 1986,
		specificFocusScope: "Power conversion, converters, inverters and drives.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 6.7,
				quartile: "Q1",
				sjr: 2.31,
				citescore: 13.2,
				totalCitations: 68000,
				articleDownloads: 730000,
			},
		],
		pricings: [],
		editorial: {
			submissionToFirstDecision: 28,
			submissionToAcceptance: 112,
			acceptanceToPublication: 21,
			acceptanceRate: 18,
		},
	},
	{
		domain: "Electrical Engineering",
		subCategory: "Power Electronics",
		title: "IET Power Electronics",
		acronym: "IET-PEL",
		publisher: "Oxford",
		publicationType: "Journal",
		openAccessType: "Full_Open_Access",
		workflow: "standard",
		licenseType: "CC_BY_NC",
		subBucket: "CoreGold",
		issn: "90000004",
		eissn: "90100004",
		URL: "https://ietresearch.onlinelibrary.wiley.com/journal/17554543",
		yearLunched: 2008,
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 2.1,
				quartile: "Q3",
				sjr: 0.61,
				citescore: 4.8,
				totalCitations: 7800,
				articleDownloads: 95000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "GBP", cost: 1600 }],
		editorial: {
			submissionToFirstDecision: 49,
			submissionToAcceptance: 133,
			acceptanceRate: 31,
		},
	},
	{
		domain: "Electrical Engineering",
		subCategory: "Signal Processing",
		title: "IEEE Signal Processing Letters",
		acronym: "SPL",
		publisher: "IEEE",
		publicationType: "Letter",
		openAccessType: "Hybrid",
		workflow: "standard",
		licenseType: "CC_BY_ND",
		issn: "90000005",
		eissn: "90100005",
		URL: "https://signalprocessingsociety.org/publications/spl",
		yearLunched: 1994,
		specificFocusScope: "Short reports on signal processing theory and methods.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 3.2,
				quartile: "Q2",
				sjr: 0.94,
				citescore: 6.9,
				totalCitations: 21000,
				articleDownloads: 260000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "USD", cost: 1750 }],
		editorial: {
			submissionToFirstDecision: 14,
			submissionToAcceptance: 49,
			acceptanceRate: 33,
		},
	},
	{
		domain: "Electrical Engineering",
		subCategory: "Signal Processing",
		title: "IEEE Signal Processing Magazine",
		acronym: "SPM",
		publisher: "IEEE",
		publicationType: "Magazine",
		openAccessType: "Bronze_Open_Access",
		workflow: "non_standard",
		issn: "90000006",
		URL: "https://signalprocessingsociety.org/publications/spm",
		yearLunched: 1991,
		imprint: "IEEE Signal Processing Society",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 9.4,
				quartile: "Q1",
				sjr: 4.12,
				citescore: 22.7,
				totalCitations: 33000,
				articleDownloads: 410000,
			},
		],
		pricings: [],
		editorial: { submissionToFirstDecision: 56, submissionToAcceptance: 168 },
	},
	{
		domain: "Computer Science",
		subCategory: "Artificial Intelligence",
		title: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
		acronym: "TPAMI",
		publisher: "IEEE",
		publicationType: "Transaction",
		openAccessType: "Golden_Open_Access",
		workflow: "standard",
		licenseType: "CC_BY_NC_ND",
		subBucket: "CoreGold",
		issn: "90000007",
		eissn: "90100007",
		URL: "https://www.computer.org/csdl/journal/tp",
		yearLunched: 1979,
		specificFocusScope:
			"Computer vision, pattern recognition and machine intelligence.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 20.8,
				impactFactor5yr: 22.4,
				quartile: "Q1",
				jci: 6.02,
				sjr: 6.02,
				h5Index: 195,
				citescore: 41.5,
				totalCitations: 190000,
				articleDownloads: 2100000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "USD", cost: 2645 }],
		editorial: {
			submissionToFirstDecision: 42,
			submissionToAcceptance: 196,
			acceptanceToPublication: 28,
			acceptanceRate: 9.5,
		},
	},
	{
		domain: "Computer Science",
		subCategory: "Artificial Intelligence",
		title: "Journal of Machine Learning Research",
		acronym: "JMLR",
		publisher: "MDPI",
		publicationType: "Journal",
		openAccessType: "Diamond_Open_Access",
		workflow: "standard",
		licenseType: "CC_BY",
		subBucket: "CoreGold",
		issn: "90000008",
		eissn: "90100008",
		URL: "https://www.jmlr.org",
		yearLunched: 2000,
		specificFocusScope: "Machine learning theory, methods and applications.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 4.3,
				quartile: "Q1",
				sjr: 2.05,
				citescore: 8.6,
				totalCitations: 33000,
				articleDownloads: 410000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "USD", cost: 0 }],
		editorial: {
			submissionToFirstDecision: 35,
			submissionToAcceptance: 154,
			acceptanceToPublication: 7,
			acceptanceRate: 12,
		},
	},
	{
		domain: "Computer Science",
		subCategory: "Security & Privacy",
		title: "IEEE Security & Privacy",
		publisher: "ACM",
		publicationType: "Magazine",
		openAccessType: "Bronze_Open_Access",
		workflow: "non_standard",
		issn: "90000009",
		yearLunched: 2003,
		imprint: "IEEE Computer Society",
		specificFocusScope: "Practitioner-facing security and privacy coverage.",
		metrics: [
			{
				metricYear: 2023,
				indexingService: "ESCI",
				impactFactor: 1.9,
				quartile: "Q3",
				sjr: 0.54,
				citescore: 3.1,
				totalCitations: 4200,
				articleDownloads: 61000,
			},
		],
		pricings: [{ pricingYear: 2023, currency: "EUR", cost: 1450 }],
	},
	{
		domain: "Computer Science",
		subCategory: "Security & Privacy",
		title: "ACM Transactions on Privacy and Security",
		acronym: "TOPS",
		publisher: "ACM",
		publicationType: "Transaction",
		openAccessType: "Hybrid",
		workflow: "standard",
		licenseType: "CC_BY_SA",
		issn: "90000010",
		eissn: "90100010",
		URL: "https://dl.acm.org/journal/tops",
		yearLunched: 1998,
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 3,
				quartile: "Q2",
				sjr: 1.11,
				citescore: 5.4,
				totalCitations: 5600,
				articleDownloads: 78000,
			},
		],
		// Two currencies — the table lists the lowest fee per currency.
		pricings: [
			{ pricingYear: 2024, currency: "USD", cost: 1700 },
			{ pricingYear: 2024, currency: "EUR", cost: 1550 },
		],
		editorial: {
			submissionToFirstDecision: 63,
			submissionToAcceptance: 189,
			acceptanceRate: 21,
		},
	},
	{
		domain: "Computer Science",
		subCategory: "Software Engineering",
		title: "Empirical Software Engineering",
		acronym: "EMSE",
		publisher: "Springer",
		publicationType: "Journal",
		openAccessType: "Green_Open_Access",
		workflow: "standard",
		licenseType: "CC_BY",
		issn: "90000011",
		eissn: "90100011",
		URL: "https://link.springer.com/journal/10664",
		yearLunched: 1996,
		specificFocusScope:
			"Empirical studies of software development practice and tooling.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 3.8,
				quartile: "Q2",
				sjr: 1.28,
				citescore: 7.2,
				totalCitations: 9100,
				articleDownloads: 120000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "EUR", cost: 2290 }],
		editorial: {
			submissionToFirstDecision: 70,
			submissionToAcceptance: 231,
			acceptanceRate: 27,
		},
	},
	{
		domain: "Computer Science",
		subCategory: "Software Engineering",
		title: "Journal of Systems and Software",
		acronym: "JSS",
		publisher: "ElSevier",
		publicationType: "Journal",
		openAccessType: "Subscriber_Based_Access",
		workflow: "standard",
		issn: "90000012",
		URL: "https://www.sciencedirect.com/journal/journal-of-systems-and-software",
		yearLunched: 1979,
		metrics: [
			{
				metricYear: 2022,
				indexingService: "SCIE",
				impactFactor: 3.5,
				quartile: "Q2",
				sjr: 1.05,
				citescore: 7.9,
				totalCitations: 14000,
				articleDownloads: 165000,
			},
		],
		pricings: [],
		editorial: {
			submissionToFirstDecision: 77,
			submissionToAcceptance: 245,
			acceptanceRate: 19,
		},
	},
	{
		domain: "Materials Science",
		subCategory: "Nanomaterials",
		title: "Nanotechnology Letters",
		acronym: "NANOL",
		publisher: "Springer",
		publicationType: "Letter",
		openAccessType: "Full_Open_Access",
		workflow: "standard",
		licenseType: "CC_BY_SA",
		subBucket: "CellPressGold",
		issn: "90000013",
		eissn: "90100013",
		URL: "https://example.org/nanotechnology-letters",
		yearLunched: 2011,
		specificFocusScope: "Short reports on nanoscale materials and devices.",
		metrics: [
			{
				metricYear: 2022,
				indexingService: "SSCI",
				impactFactor: 2.45,
				quartile: "Q2",
				sjr: 0.88,
				citescore: 4,
				totalCitations: 900,
				articleDownloads: 22000,
			},
		],
		pricings: [{ pricingYear: 2022, currency: "GBP", cost: 890 }],
		editorial: {
			submissionToFirstDecision: 14,
			submissionToAcceptance: 56,
			acceptanceToPublication: 10,
			acceptanceRate: 42,
		},
	},
	{
		domain: "Materials Science",
		subCategory: "Semiconductors",
		title: "Journal of Semiconductor Technology and Science",
		acronym: "JSTS",
		publisher: "Sage",
		publicationType: "Journal",
		openAccessType: "Diamond_Open_Access",
		workflow: "standard",
		licenseType: "CC",
		issn: "90000014",
		URL: "https://www.jsts.org",
		yearLunched: 2001,
		metrics: [
			{
				metricYear: 2023,
				indexingService: "ESCI",
				impactFactor: 0.9,
				quartile: "Q4",
				sjr: 0.21,
				citescore: 1.6,
				totalCitations: 700,
				articleDownloads: 14000,
			},
		],
		pricings: [{ pricingYear: 2023, currency: "USD", cost: 0 }],
		editorial: {
			submissionToFirstDecision: 21,
			submissionToAcceptance: 70,
			acceptanceRate: 48,
		},
	},
	{
		domain: "Materials Science",
		subCategory: "Semiconductors",
		title: "Semiconductor Science and Technology",
		acronym: "SST",
		publisher: "TaylorAFrancis",
		publicationType: "Journal",
		openAccessType: "Hybrid",
		workflow: "standard",
		licenseType: "CC_BY_NC_ND",
		issn: "90000015",
		eissn: "90100015",
		yearLunched: 1986,
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 1.8,
				quartile: "Q3",
				sjr: 0.49,
				citescore: 4.2,
				totalCitations: 11000,
				articleDownloads: 88000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "GBP", cost: 2100 }],
		editorial: {
			submissionToFirstDecision: 35,
			submissionToAcceptance: 119,
			acceptanceRate: 36,
		},
	},
	{
		domain: "Biomedical Engineering",
		subCategory: "Medical Imaging",
		title: "IEEE Transactions on Medical Imaging",
		acronym: "TMI",
		publisher: "IEEE",
		publicationType: "Transaction",
		openAccessType: "Hybrid",
		workflow: "standard",
		licenseType: "CC_BY",
		issn: "90000016",
		eissn: "90100016",
		URL: "https://www.embs.org/tmi/",
		yearLunched: 1982,
		specificFocusScope:
			"Imaging physics, reconstruction and image analysis for medicine.",
		metrics: [
			{
				metricYear: 2024,
				indexingService: "SCIE",
				impactFactor: 8.9,
				quartile: "Q1",
				sjr: 3.44,
				h5Index: 112,
				citescore: 19.3,
				totalCitations: 74000,
				articleDownloads: 690000,
			},
		],
		pricings: [{ pricingYear: 2024, currency: "USD", cost: 2295 }],
		editorial: {
			submissionToFirstDecision: 28,
			submissionToAcceptance: 126,
			acceptanceToPublication: 21,
			acceptanceRate: 22,
		},
	},
	{
		domain: "Biomedical Engineering",
		subCategory: "Medical Imaging",
		title: "Biomedical Optics Express Letters",
		acronym: "BOEL",
		publisher: "APS",
		publicationType: "Letter",
		openAccessType: "Golden_Open_Access",
		workflow: "standard",
		licenseType: "CC_BY",
		subBucket: "TheLancetGold",
		issn: "90000017",
		yearLunched: 2010,
		metrics: [
			{
				metricYear: 2023,
				indexingService: "ESCI",
				impactFactor: 3.1,
				quartile: "Q3",
				sjr: 1.02,
				citescore: 6,
				totalCitations: 3300,
				articleDownloads: 47000,
			},
		],
		pricings: [{ pricingYear: 2023, currency: "EUR", cost: 1290 }],
		editorial: {
			submissionToFirstDecision: 17,
			submissionToAcceptance: 63,
			acceptanceRate: 39,
		},
	},
];

const SEEDED_TITLES = PUBLICATIONS.map((publication) => publication.title);

async function clear() {
	const publications = await db.academicPublication.findMany({
		where: { title: { in: SEEDED_TITLES } },
		select: { id: true },
	});
	const ids = publications.map((publication) => publication.id);

	// The child tables cascade on delete, but be explicit so a partial run is safe.
	await db.publicationYearlyMetric.deleteMany({
		where: { publicationId: { in: ids } },
	});
	await db.publicationPricing.deleteMany({
		where: { publicationId: { in: ids } },
	});
	await db.publicationEditorialStat.deleteMany({
		where: { publicationId: { in: ids } },
	});
	await db.academicPublication.deleteMany({ where: { id: { in: ids } } });

	// Only drop subcategories and domains that are now unreferenced.
	await db.publicationSubCategory.deleteMany({
		where: { publications: { none: {} } },
	});
	await db.publicationDomain.deleteMany({
		where: { subCategories: { none: {} } },
	});

	console.log(`Removed ${ids.length} seeded publications.`);
}

async function seed() {
	const domainIds = new Map<string, number>();
	const subCategoryIds = new Map<string, number>();

	for (const entry of PUBLICATIONS) {
		if (!domainIds.has(entry.domain)) {
			const domain = await db.publicationDomain.upsert({
				where: { name: entry.domain },
				update: {},
				create: { name: entry.domain },
			});
			domainIds.set(entry.domain, domain.id);
		}
		const domainId = domainIds.get(entry.domain)!;

		// `name` is not unique on its own, so match on (name, domainId).
		const subCategoryKey = `${entry.domain}::${entry.subCategory}`;
		if (!subCategoryIds.has(subCategoryKey)) {
			const existing = await db.publicationSubCategory.findFirst({
				where: { name: entry.subCategory, domainId },
			});
			const subCategory =
				existing ??
				(await db.publicationSubCategory.create({
					data: { name: entry.subCategory, domainId },
				}));
			subCategoryIds.set(subCategoryKey, subCategory.id);
		}
		const subCategoryId = subCategoryIds.get(subCategoryKey)!;

		const {
			domain: _domain,
			subCategory: _subCategory,
			metrics,
			pricings,
			editorial,
			...fields
		} = entry;

		// `title` is no longer unique on this branch, so match on it explicitly.
		const existing = await db.academicPublication.findFirst({
			where: { title: entry.title },
			select: { id: true },
		});

		const publication = existing
			? await db.academicPublication.update({
					where: { id: existing.id },
					data: { ...fields, subCategoryId },
				})
			: await db.academicPublication.create({
					data: { ...fields, subCategoryId },
				});

		// Replace children wholesale so re-runs stay idempotent.
		const publicationId = publication.id;
		await Promise.all([
			db.publicationYearlyMetric.deleteMany({ where: { publicationId } }),
			db.publicationPricing.deleteMany({ where: { publicationId } }),
			db.publicationEditorialStat.deleteMany({ where: { publicationId } }),
		]);

		if (metrics.length > 0) {
			await db.publicationYearlyMetric.createMany({
				data: metrics.map((metric) => ({ ...metric, publicationId })),
			});
		}
		if (pricings.length > 0) {
			await db.publicationPricing.createMany({
				data: pricings.map((pricing) => ({ ...pricing, publicationId })),
			});
		}
		if (editorial) {
			await db.publicationEditorialStat.create({
				data: { ...editorial, publicationId },
			});
		}
	}

	const [publications, metrics, pricings, editorialStats] = await Promise.all([
		db.academicPublication.count(),
		db.publicationYearlyMetric.count(),
		db.publicationPricing.count(),
		db.publicationEditorialStat.count(),
	]);

	console.log(
		`Seeded ${publications} publications, ${metrics} metrics, ${pricings} pricings, ${editorialStats} editorial stats.`,
	);
}

const run = process.argv.includes("--clear") ? clear : seed;

run()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await db.$disconnect();
	});
