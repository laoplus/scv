import React from "react";
import { GridTableRenderer } from "../../components/GridTable";
import { cn } from "../../components/utils";
import { onBeforeRender } from "./index.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

function MapRenderer({
  eventIndexStr,
  stages,
}: {
  eventIndexStr: string;
  stages: PageProps["eventStories"][number][number]["ChapterStages"];
}) {
  return (
    <div className="grid grid-cols-8 gap-1">
      {stages.map((s) => (
        <a
          key={s.StageName}
          style={{
            order: s.StagePos,
          }}
          className={cn(
            "min-w-[2rem] select-none whitespace-nowrap rounded border-b-4 p-1 pb-0.5",
            "border-yellow-500 bg-slate-700 text-white",
            {
              "border-rose-500": s.StageSubTypeStr === "EX",
            },
            {
              "border-lime-500": s.StageSubTypeStr === "SUB",
            },
            {
              "opacity-50": !s.hasCutscene,
            }
          )}
          href={
            s.hasCutscene
              ? `/scenes/${eventIndexStr}/${s.StageIdxString}`.toLowerCase()
              : undefined
          }
          title={`${s.StageIdxString} ${s.StageName}${
            !s.hasCutscene ? "\n（カットシーンなし）" : ""
          }`}
        >
          {s.StageIdxString}
        </a>
      ))}
      {[...Array(8 * 3).keys()].map((_) => {
        if (stages.find((s) => s.StagePos === _)) {
          return;
        }
        return <div key={`${eventIndexStr}/${_}`} style={{ order: _ }}></div>;
      })}
    </div>
  );
}

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

                  <GridTableRenderer
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
