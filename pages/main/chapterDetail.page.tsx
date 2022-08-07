import React from "react";
import { StageGridTable } from "../../components/GridTable";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./chapterDetail.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ chapter }: PageProps) {
  return (
    <>
      <Heading level={1}>Main Stories</Heading>

      <div className="flex flex-col gap-8 p-2">
        <div
          key={chapter.Chapter_IDX}
          id={`${chapter.Chapter_IDX}`}
          className="flex flex-col gap-4"
        >
          <h2 className="sticky top-0 text-2xl">{chapter.ChapterName}</h2>
          <StageGridTable eventIndexStr="main" stages={chapter.ChapterStages} />
        </div>
      </div>
    </>
  );
}
