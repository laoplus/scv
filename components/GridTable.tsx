import React from "react";
import { EventStories } from "../pages/events/index.page.server";
import { cn } from "./utils";

export function GridTableRenderer({
  eventIndexStr,
  stages,
}: {
  eventIndexStr: string;
  stages: EventStories[number][number]["ChapterStages"];
}) {
  return (
    <div className="grid grid-cols-[4px_max-content_minmax(10rem,1fr)_4rem_4rem_4rem] items-center gap-2">
      {stages.map((s) => (
        <div
          key={s.StageName}
          className={s.hasCutscene ? "contents" : "hidden"}
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
          <div className="pr-1">{s.StageIdxString}</div>
          <div>{s.StageName}</div>
          <div>
            {s.StartCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`/scenes/${eventIndexStr}/${s.StageIdxString}/op`.toLowerCase()}
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
                href={`/scenes/${eventIndexStr}/${s.StageIdxString}/ed`.toLowerCase()}
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
                    href={`/scenes/${eventIndexStr}/${s.StageIdxString}/mid${
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