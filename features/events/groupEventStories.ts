export function groupEventStories<T extends { Event_Category: string }>(
    events: readonly T[],
): T[][] {
    const groups = Object.create(null) as Record<string, T[]>;
    for (const event of events) {
        (groups[event.Event_Category] ??= []).push(event);
    }
    return Object.values(groups);
}
