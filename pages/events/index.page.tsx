import React from "react";
import { StageGridTable } from "../../components/GridTable";
import { onBeforeRender } from "./index.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ eventStories }: PageProps) {
  // console.log(eventStories);
  return (
    <>
      <h1 className="mb-4 text-6xl uppercase">Event Scenes</h1>

      <div className="flex flex-col gap-8">
        {eventStories.map((event) => (
          <div
            key={event[0].Event_Category}
            id={`ev${event[0].Event_CategoryIndex}`}
            className="flex flex-col gap-4"
          >
            <h3 className="text-2xl">
              Ev{event[0].Event_CategoryIndex}: {event[0].Event_CategoryName}
            </h3>

            {event.map((chapter) =>
              chapter.ChapterStages.every((s) => !s.hasCutscene) ? undefined : ( // 全てのステージがシーンなしの場合
                <div key={chapter.Chapter_Name} className="flex flex-col gap-3">
                  {event.length !== 1 && (
                    <h4 className="font-semibold">{chapter.Chapter_Name}</h4>
                  )}

                  <StageGridTable
                    eventIndexStr={`ev${event[0].Event_CategoryIndex}`}
                    stages={chapter.ChapterStages}
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </>
  );
}
