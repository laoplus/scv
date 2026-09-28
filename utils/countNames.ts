export function countNames(names: readonly (string | null)[]) {
    const counts = new Map<string | null, number>();
    for (const name of names) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
}
