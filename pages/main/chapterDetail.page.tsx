import React from "react";
import { StageGridTable } from "../../components/GridTable";
import { onBeforeRender } from "./chapterDetail.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ chapteres }: PageProps) {
  return (
    <>
      <h1 className="mb-4 text-6xl uppercase">Main Scenes</h1>

      <div className="flex flex-col gap-8 p-2">
        {chapteres.map((c) => (
          <div
            key={c.Chapter_IDX}
            id={`${c.Chapter_IDX}`}
            className="flex flex-col gap-4"
          >
            <h2 className="sticky top-0 text-2xl">{c.ChapterName}</h2>
            <StageGridTable eventIndexStr="main" stages={c.ChapterStages} />
          </div>
        ))}
      </div>
    </>
  );
}
