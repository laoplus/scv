import React from "react";
import { StageGridTable } from "../../components/GridTable";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./chapterDetail.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ chapter }: PageProps) {
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
