//  HELPERS & STARTUP
// ================================================================

// Helper: Clean academic titles from names to fix S2 API calls
const cleanName = (name: string) => {
	return name
		.replace(
			/^(Professor\.|Professor|Prof\.|Dr\.|PhD Candidate at|PhD Candidate|Associate Professor|Assistant Professor|Ph\.D\.|MSc)\s+/gi,
			"",
		)
		.replace(/,.*/, "") // Remove anything after a comma
		.trim();
};

const extractData = (row, type) => {
	const keywords = {
		name: ["companyname", "company", "name", "entity"],
		website: [
			"website",
			"web",
			"url",
			"companylink",
			"link",
			"site",
			"homepage",
		],
		linkedin: ["linkedin", "profile"],
		glassdoor: ["glassdoor", "review"],
		size: ["size", "employee", "staff", "number"],
		category: ["category", "cat", "sector"],
		industry: ["industry", "focus", "vlsi", "specialization"],
		presence: ["presence", "type", "status"],
		location: ["country", "state", "location", "region", "hq"],
	};

	const targetKeys = keywords[type] || [];
	const rowKeys = Object.keys(row);

	// Find matching key
	let matchKey = rowKeys.find((key) =>
		targetKeys.some((k: string) =>
			key
				.toLowerCase()
				.replace(/[^a-z]/g, "")
				.includes(k),
		),
	);

	let value = matchKey ? row[matchKey] : null;

	if (value && typeof value === "string") {
		return value.trim();
	}
	return "";
};

const extractTopField = (papers) => {
	if (!papers || papers.length === 0) return "General Science";
	const fieldCounts = {};
	papers.forEach((p) => {
		if (p.fieldsOfStudy) {
			p.fieldsOfStudy.forEach((field) => {
				fieldCounts[field] = (fieldCounts[field] || 0) + 1;
			});
		}
	});
	const sortedFields = Object.entries(fieldCounts).sort(
		(a, b) => +b[1] - +a[1],
	);
	return sortedFields.length > 0 ? sortedFields[0][0] : "Multidisciplinary";
};

const getFuzzyValue = (row, keywords) => {
	const keys = Object.keys(row);
	// Find a key that contains one of the keywords (case insensitive)
	const match = keys.find((key) =>
		keywords.some((word) =>
			key
				.toLowerCase()
				.replace(/[^a-z]/g, "")
				.includes(word),
		),
	);
	return match ? row[match] : "";
};

export { cleanName, extractData, extractTopField, getFuzzyValue };
