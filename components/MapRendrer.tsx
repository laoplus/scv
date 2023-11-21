import React from "react";

import { EventStories } from "../pages/events/index.page.server";
import { cn } from "./utils";

export function MapRenderer({
  eventIndexStr,
  stages,
}: {
  eventIndexStr: string;
  stages: EventStories[number][number]["ChapterStages"];
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
            },
          )}
          href={
            s.hasCutscene
              ? `/scenes/${eventIndexStr}/${s.StageIdxString}/`.toLowerCase()
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
