import clsx, { ClassValue } from "clsx";
import React from "react";
import { overrideTailwindClasses } from "tailwind-override";
import { PageContextBuiltIn } from "vite-plugin-ssr";
import { Hoge } from "./index.page.server";
import _ from "lodash";

export { Page };

export const cn = (...classNames: ClassValue[]) => {
  return overrideTailwindClasses(clsx(...classNames));
};

function MapRenderer({ stage }: { stage: Hoge[number]["Stages"] }) {
  return (
    <div className="grid grid-cols-8 gap-1">
      {stage.map((s) => (
        <a
          key={s.StageName}
          style={{
            order: s.StagePos,
          }}
          className={cn(
            "min-w-[2rem] whitespace-nowrap rounded border-b-4 p-1 pb-0.5",
            "border-yellow-500 bg-slate-600 text-white",
            {
              "border-rose-500": s.StageSubTypeStr === "EX",
            },
            {
              "border-lime-500": s.StageSubTypeStr === "SUB",
            }
          )}
          // href={`/scenarios/${c.ChapterName}/${s.StageIdxString}`}
          title={`${s.StageIdxString} ${s.StageName}`}
        >
          {s.StageIdxString}
        </a>
      ))}
      {[...Array(8 * 3).keys()].map((_) => {
        if (stage.find((s) => s.StagePos === _)) {
          return;
        }
        return <div key={`${_}`} style={{ order: _ }}></div>;
      })}
    </div>
  );
}

function Page({ ss, hoge }: { ss: string[]; hoge: Hoge }) {
  const event = hoge.filter((c) => c.GameModeType === 4);

  const events = _.chain(event)
    .groupBy((c) => c.EventCategory)
    .toArray()
    .value();
  console.log(events);

  return (
    <>
      <h1 className="mb-4 text-6xl uppercase">scenarios</h1>

      <div className="flex flex-col gap-4">
        {hoge
          .filter((c) => c.GameModeType === 0)
          .map((c, i) => (
            <div key={c.ChapterName} className="flex flex-col gap-2">
              <h2 className="flex items-center ">
                <span className="text-2xl leading-none">第{i + 1}区域</span>
                <span className="text-sm leading-none opacity-50">
                  {c.ChapterName}
                </span>
              </h2>

              <MapRenderer stage={c.Stages} />
            </div>
          ))}

        {events.map((c, i) => (
          <div key={c[0].ChapterName} className="flex flex-col gap-2">
            <h2 className="flex items-center ">
              <span className="text-2xl leading-none">Event {i + 1}</span>
              <span className="text-sm leading-none opacity-50">
                {c[0].ChapterName}
              </span>
            </h2>

            {c.map((e) => (
              <div key={e.ChapterName} className="flex flex-col gap-2">
                <h3 className="flex items-center">{e.ChapterName}</h3>

                <MapRenderer stage={e.Stages} />
              </div>
            ))}
          </div>
        ))}

        {/* {hoge.map((c) => {
          if (c.Stages.length === 0) return;
          return (
            <div key={c.ChapterName} className="flex flex-col gap-4">
              <h2 className="text-2xl leading-none">
                <span className="mr-2 rounded-md border p-1 text-base font-bold">
                  {c.GameModeType === 0 ? "Main" : "Event"}
                </span>

                {c.ChapterName}
              </h2>
            </div>
          );
        })} */}
      </div>
    </>
  );
}
