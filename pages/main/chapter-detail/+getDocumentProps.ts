import { onBeforeRender } from "./+onBeforeRender";
export function getDocumentProps({ pageProps: { chapters } }: PageContext) {
    const firstChapter = chapters[0];
    if (!firstChapter) throw new Error("Chapter not found");

    return {
        title: ["メインストーリー", `第${firstChapter.Chapter_IDX}区域`].join(" "),
        description: "「" + firstChapter.ChapterName + "」",
    };
}

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];
