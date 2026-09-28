import { tables } from "../serverUtil";
// filter unreleased events

const bannedEventChapter: string[] = [];

export const publicEvents = tables.events.filter(
    (c) => !bannedEventChapter.includes(c.Chapter_Key),
);
