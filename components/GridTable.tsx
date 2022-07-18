import React, { Fragment } from "react";
import { EventStories } from "../pages/events/eventDetails.page.server";
import { UnitIcon } from "./UnitIcon";
import { cn } from "./utils";

const UnitIconGroup = ({
  characters,
}: {
  characters: EventStories[number][number]["ChapterStages"][number]["StartCutsceneCharcters"];
}) => (
  <>
    {characters.map((c, i) => {
      const url =
        `https://cdn.laoplus.net/formationicon/` +
        c.image
          .replace("2DModel_", "FormationIcon_")
          .replace("_DL_N", "")
          .replace("_Commu", "_N") +
        ".webp";

      return (
        <UnitIcon
          key={`${i}-${c.name}`}
          title={c.name}
          alt={c.name}
          data-counts={c.counts}
          data-filename={c.image}
          src={url + "?class=icon"}
          srcSet={[`${url}?class=icon 1x`, `${url}?class=icon2x 2x`].join(",")}
          className="pointer-events-auto relative -z-20 aspect-square h-10 w-10"
          withInsetBorder={true}
        />
      );
    })}
  </>
);

export function StageGridTable({
  eventIndexStr,
  stages,
}: {
  eventIndexStr: string;
  stages: EventStories[number][number]["ChapterStages"];
}) {
  return (
    <div className="z-10 grid grid-cols-[4px_max-content_minmax(10rem,1fr)] items-center gap-2">
      {stages.map((s) =>
        !s.hasCutscene ? null : (
          <Fragment key={s.StageName}>
            <div
              className={cn(
                "row-span-2 h-full min-h-[24px] rounded bg-yellow-500",
                {
                  "bg-rose-500": s.StageSubTypeStr === "EX",
                },
                {
                  "bg-lime-500": s.StageSubTypeStr === "SUB",
                }
              )}
            />
            <a
              className="pr-1"
              id={`${eventIndexStr}-${s.StageIdxString}`}
              href={`#${eventIndexStr}-${s.StageIdxString}`}
            >
              {s.StageIdxString}
            </a>
            <div>{s.StageName}</div>
            {/* 2列目 */}
            <div className="col-start-3 -mt-2 -mb-0.5 text-sm text-gray-600">
              {s.StageDesc}
            </div>
            {/* 3列目 */}
            <div />
            {s.StartCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`/scenes/${eventIndexStr}/${s.StageIdxString}/op`.toLowerCase()}
                className="inline-flex h-10 min-w-[2.5rem] items-center justify-center self-start rounded border p-1 px-2 leading-[100%] text-sky-700"
              >
                OP
              </a>
            )}
            <div className="pointer-events-none flex flex-wrap gap-1">
              <UnitIconGroup characters={s.StartCutsceneCharcters} />
            </div>
            <div />
            {s.EndCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`/scenes/${eventIndexStr}/${s.StageIdxString}/ed`.toLowerCase()}
                className="inline-flex h-10 min-w-[2.5rem] items-center justify-center self-start rounded border p-1 px-2 leading-[100%] text-sky-700"
              >
                ED
              </a>
            )}
            <div className="pointer-events-none flex flex-wrap gap-1">
              <UnitIconGroup characters={s.EndCutsceneCharcters} />
            </div>
            {s.MidCutsceneIndex.length !== 1 && s.MidCutsceneIndex[0] !== "0" && (
              <div className="col-span-full">
                {s.MidCutsceneIndex.map((sceneId, i) => (
                  <a
                    key={sceneId}
                    href={`/scenes/${eventIndexStr}/${s.StageIdxString}/mid${
                      i + 1
                    }`.toLowerCase()}
                    className="inline-block p-1 text-sky-700"
                  >
                    Mid {i + 1}
                  </a>
                ))}
              </div>
            )}
          </Fragment>
        )
      )}
    </div>
  );
}
