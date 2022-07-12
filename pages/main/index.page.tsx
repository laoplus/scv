import React from "react";
import { GridTableRenderer } from "../../components/GridTable";
import { onBeforeRender } from "./index.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ chapteres }: PageProps) {
  return (
    <>
      <h1 className="mb-4 text-6xl uppercase">Main Scenes</h1>

      <div className="flex flex-col gap-8">
        {chapteres.map((c) => (
          <div
            key={c.Chapter_IDX}
            id={`${c.Chapter_IDX}`}
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl">{c.ChapterName}</h2>
            <GridTableRenderer eventIndexStr="main" stages={c.ChapterStages} />
          </div>
        ))}
      </div>
    </>
  );
}