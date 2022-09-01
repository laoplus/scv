import React from "react";
import { StageGridTable } from "../../components/GridTable";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./chapterDetail.page.server";

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];

export function getDocumentProps({ pageProps: { chapter } }: PageContext) {
  return {
    title: ["メインストーリー", `第${chapter.Chapter_IDX}区域`].join(" "),
    description: "「" + chapter.ChapterName + "」",
  };
}

export function Page({ chapter }: PageContext["pageProps"]) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <Heading level={1}>Main Stories</Heading>

      <div
        key={chapter.Chapter_IDX}
        id={`${chapter.Chapter_IDX}`}
        className="flex flex-col gap-6 px-4 md:px-0"
      >
        <h2 className="text-2xl">{chapter.ChapterName}</h2>
        <StageGridTable eventIndexStr="main" stages={chapter.ChapterStages} />
      </div>
    </div>
  );
}
