export function parseYearBounds(fromYear: unknown, toYear: unknown) {
    if (fromYear === undefined && toYear === undefined) return undefined;

    const gte = parseYear(fromYear);
    const lte = parseYear(toYear);
    if (gte === null || lte === null || (gte !== undefined && lte !== undefined && gte > lte)) {
        return null;
    }
    return { gte, lte };
}

function parseYear(value: unknown) {
    if (value === undefined) return undefined;
    if (typeof value !== "string" || !/^\d{1,4}$/.test(value)) return null;
    return Number(value) || null;
}
