import { tables } from "../../serverUtil";
export const onBeforePrerenderStart = () => {
    const chapters = tables.chapters.filter((c) => c.GameModeType === 0);

    const chapterIndex = [...new Set(chapters.map((e) => e.Chapter_IDX))];
    return chapterIndex.map((i) => `/main/${i}`);
};
