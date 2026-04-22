// Helper: robust CSV row parser that handles quoted fields with commas
const parseCSVRow = (str: string) => {
	const result = [];
	let curr = "";
	let inQuotes = false;
	for (const element of str) {
		let c = element; // SOLVED
		if (c === '"') inQuotes = !inQuotes;
		else if (c === "," && !inQuotes) {
			result.push(curr.trim());
			curr = "";
		} else curr += c;
	}
	result.push(curr.trim());
	return result;
};

export { parseCSVRow };
