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

function GridTableRenderer({
  eventIndexStr,
  stages,
}: {
  eventIndexStr: string;
  stages: PageProps["eventStories"][number][number]["ChapterStages"];
}) {
  return (
    <div className="grid grid-cols-[4px_max-content_minmax(10rem,1fr)_4rem_4rem_4rem] items-center gap-2">
      {stages.map((s) => (
        <div
          key={s.StageName}
          className={cn("contents", {
            "[&>div]:opacity-50": !s.hasCutscene,
          })}
        >
          <div
            className={cn(
              "h-6 rounded bg-yellow-500",
              {
                "bg-rose-500": s.StageSubTypeStr === "EX",
              },
              {
                "bg-lime-500": s.StageSubTypeStr === "SUB",
              }
            )}
          />
          <div>{s.StageIdxString}</div>
          <div>{s.StageName}</div>
          <div>
            {s.StartCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`${eventIndexStr}/${s.StageIdxString}/op`.toLowerCase()}
                className="inline-block p-1 text-sky-600"
              >
                OP
              </a>
            )}
          </div>
          <div>
            {s.EndCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`${eventIndexStr}/${s.StageIdxString}/ed`.toLowerCase()}
                className="inline-block p-1 text-sky-600"
              >
                ED
              </a>
            )}
          </div>
          <div>
            {s.MidCutsceneIndex.length === 1 && s.MidCutsceneIndex[0] === "0"
              ? "-"
              : s.MidCutsceneIndex.map((sceneId, i) => (
                  <a
                    key={sceneId}
                    href={`${eventIndexStr}/${s.StageIdxString}/mid${
                      i + 1
                    }`.toLowerCase()}
                    className="inline-block p-1 text-sky-600"
                  >
                    Mid {i + 1}
                  </a>
                ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Page({ eventStories }: PageProps) {
  // console.log(eventStories);
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
                <div key={chapter.Chapter_Name} className="flex flex-col gap-2">
                  {event.length !== 1 && (
                    <h4 className="font-semibold">{chapter.Chapter_Name}</h4>
                  )}

                  <GridTableRenderer
                    eventIndexStr={`ev${event[0].Event_CategoryIndex}`}
                    stages={chapter.ChapterStages}
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
