export function readFacetValues(value: unknown): string[] {
    const items = Array.isArray(value) ? value : [value];
    return [...new Set(items.filter((item): item is string => typeof item === "string" && item.trim() !== ""))];
}

const placeholderValues = new Set(["", "unknown", "n/a", "na", "none", "null", "-", "—"]);

export function catalogFacetValues(values: (string | null)[]): string[] {
    const options = new Map<string, string>();
    for (const value of values) {
        if (value === null || placeholderValues.has(value.trim().toLowerCase())) continue;
        // Keep the stored value for exact matching, including any surrounding spaces.
        const key = value.toLowerCase();
        if (!options.has(key)) options.set(key, value);
    }
    return [...options.values()].sort((a, b) => a.trim().localeCompare(b.trim()));
}
