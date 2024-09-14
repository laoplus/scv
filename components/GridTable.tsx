import React, { Fragment } from "react";

import { onBeforeRender } from "../pages/events/details/+onBeforeRender";
import { UnitIcon } from "./UnitIcon";
import { cn } from "./utils";

type EventStories = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["eventStories"];

type SubStoryGroups = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["subStoryGroups"];

const UnitIconGroup = ({
  characters,
}: {
  characters: EventStories[number][number]["ChapterStages"][number]["StartCutsceneCharcters"];
}) => (
  <>
    {characters.map((c, i) => {
      const url =
        `${import.meta.env.VITE_CDN_BASE_URL}/formationicon/` +
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
          src={url}
          className="pointer-events-auto relative aspect-square h-10 w-10 rounded"
          borderClassName="rounded"
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
    <div className="grid grid-cols-[4px_max-content_minmax(10rem,1fr)] items-center gap-2">
      {stages.map((s) =>
        !s.hasCutscene ? null : (
          <Fragment key={`${s.StageIdxString} ${s.StageName}`}>
            <div
              className={cn(
                "row-span-2 h-full min-h-[24px] rounded bg-yellow-500",
                {
                  "bg-rose-500": s.StageSubTypeStr === "EX",
                },
                {
                  "bg-lime-500": s.StageSubTypeStr === "SUB",
                },
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

            {/* OPの列 */}
            {s.StartCutsceneIndex !== "0" && (
              <>
                <div />
                <a
                  href={`/scenes/${eventIndexStr}/${s.StageIdxString}/op/`.toLowerCase()}
                  className="inline-flex h-10 min-w-[2.5rem] items-center justify-center self-start rounded border p-1 px-2 leading-[100%] text-sky-700"
                >
                  OP
                </a>
                <div className="pointer-events-none flex flex-wrap gap-1">
                  <UnitIconGroup characters={s.StartCutsceneCharcters} />
                </div>
              </>
            )}

            {/* Midの列 */}
            {s.MidCutsceneIndex[0] !== "0" && (
              <>
                {s.MidCutsceneIndex.map((sceneId, i) => {
                  const href =
                    `/scenes/${eventIndexStr}/${s.StageIdxString}/mid${i + 1}/`.toLowerCase();

                  return (
                    <React.Fragment key={sceneId}>
                      <div />
                      <a
                        href={href}
                        className="inline-flex h-10 min-w-[2.5rem] items-center justify-center self-start rounded border p-1 px-2 leading-[100%] text-sky-700"
                      >
                        Mid {i + 1}
                      </a>
                      <div className="pointer-events-none flex flex-wrap gap-1">
                        <UnitIconGroup characters={s.MidCutsceneCharcters[i]} />
                      </div>
                    </React.Fragment>
                  );
                })}
              </>
            )}

            {/* EDの列 */}
            {s.EndCutsceneIndex !== "0" && (
              <>
                <div />
                <a
                  href={`/scenes/${eventIndexStr}/${s.StageIdxString}/ed/`.toLowerCase()}
                  className="inline-flex h-10 min-w-[2.5rem] items-center justify-center self-start rounded border p-1 px-2 leading-[100%] text-sky-700"
                >
                  ED
                </a>
                <div className="pointer-events-none flex flex-wrap gap-1">
                  <UnitIconGroup characters={s.EndCutsceneCharcters} />
                </div>
              </>
            )}
          </Fragment>
        ),
      )}
    </div>
  );
}

export function SubStoryGridTable({
  subStoryGroup,
}: {
  subStoryGroup: SubStoryGroups[number];
}) {
  return (
    <div className="grid grid-cols-[max-content_minmax(10rem,1fr)] items-center gap-2">
      {subStoryGroup.SubStory.map((s, i) => {
        if (!s) return null;

        return (
          <React.Fragment key={i}>
            <a
              href={s.StoryPath}
              className="inline-flex h-10 min-w-[2.5rem] items-center justify-center self-start rounded border p-1 px-2 leading-[100%] text-sky-700"
            >
              {s.StoryName}
            </a>
            <div className="pointer-events-none flex flex-wrap gap-1">
              <UnitIconGroup characters={s.Characters} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
