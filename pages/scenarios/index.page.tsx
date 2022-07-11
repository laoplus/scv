import clsx, { ClassValue } from "clsx";
import React from "react";
import { overrideTailwindClasses } from "tailwind-override";
import { PageContextBuiltIn } from "vite-plugin-ssr";
import { onBeforeRender } from "./index.page.server";

export const cn = (...classNames: ClassValue[]) => {
  return overrideTailwindClasses(clsx(...classNames));
};

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
              ? `/scenarios/${eventIndexStr}/${s.StageIdxString}`.toLowerCase()
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
  return (
    <>
      <h1 className="mb-4 text-6xl uppercase">scenarios</h1>

      <div className="flex flex-col gap-4">
        <h2 className="text-4xl">Event</h2>
        <div className="flex flex-col gap-8">
          {eventStories.map((event) => (
            <div key={event[0].Event_Category} className="flex flex-col gap-2">
              <h3 className="text-2xl">
                Ev{event[0].Event_CategoryIndex}: {event[0].Event_CategoryName}
              </h3>
              {event.map((chapter) => (
                <div
                  key={chapter.Chapter_Name}
                  className="ml-8 flex flex-col gap-2"
                >
                  {event.length !== 1 && <h4>{chapter.Chapter_Name}</h4>}

                  <MapRenderer
                    stages={chapter.ChapterStages}
                    eventIndexStr={`Ev${chapter.Event_CategoryIndex}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
