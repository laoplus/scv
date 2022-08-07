import React from "react";
import { StageGridTable } from "../../components/GridTable";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./eventDetails.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ eventStories }: PageProps) {
  return (
    <>
      <Heading level={1}>
        Event Stories :: <span>{eventStories[0][0].Event_CategoryName}</span>
      </Heading>

      <div className="flex flex-col gap-8 p-2">
        {eventStories.map((event) => (
          <div
            key={event[0].Event_Category}
            id={`ev${event[0].Event_CategoryIndex}`}
            className="flex flex-col gap-4"
          >
            {event.map((chapter) =>
              chapter.ChapterStages.every((s) => !s.hasCutscene) ? undefined : ( // 全てのステージがシーンなしの場合
                <div key={chapter.Chapter_Name} className="flex flex-col gap-3">
                  {event.length !== 1 && (
                    <h3 className="font-semibold">{chapter.Chapter_Name}</h3>
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
