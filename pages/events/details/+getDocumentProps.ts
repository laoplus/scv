import { onBeforeRender } from "./+onBeforeRender";
export function getDocumentProps({ pageProps: { eventStories } }: PageContext) {
    const firstChapter = eventStories[0]?.[0];
    if (!firstChapter) throw new Error("Event chapter not found");
    return {
        title: ["イベントストーリー", firstChapter.Event_CategoryName].join(" "),
        description: "「" + firstChapter.Event_CategoryDesc + "」",
    };
}

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];
