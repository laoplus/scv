import React from "react";

import { onBeforeRender as onBeforeRenderEvents } from "../pages/events/index.page.server";
import { onBeforeRender as onBeforeRenderMain } from "../pages/main/index.page.server";
import { UnitIcon } from "./UnitIcon";
import { cn } from "./utils";

type MainPageProps = Awaited<
  ReturnType<typeof onBeforeRenderMain>
>["pageContext"]["pageProps"];
type EventsPageProps = Awaited<
  ReturnType<typeof onBeforeRenderEvents>
>["pageContext"]["pageProps"];

const checkIsEvent = (
  chapter: MainPageProps["chapters"][number] | EventsPageProps["events"][number]
): chapter is EventsPageProps["events"][number] => {
  return chapter.Event_Category !== "";
};

export const ChapterGrid = ({
  chapters,
}: {
  chapters: MainPageProps["chapters"] | EventsPageProps["events"];
}) => (
  <div className="grid gap-px overflow-hidden bg-slate-200 text-slate-700 shadow sm:grid-cols-2 md:rounded-lg lg:grid-cols-3">
    {chapters.map((chapter) => {
      const isEvent = checkIsEvent(chapter);

      return (
        <a
          key={chapter.Key}
          id={chapter.Key}
          className={cn(
            "group flex gap-6 bg-white p-6 outline-none transition-colors sm:flex-col",
            "hover:bg-slate-50",
            "focus:bg-slate-50 focus:ring focus:ring-inset"
          )}
          href={
            isEvent
              ? `/events/${chapter.Event_CategoryIndex}/`
              : `/main/${chapter.Chapter_IDX}/`
          }
        >
          <div className="flex items-center justify-between sm:mb-7">
            <UnitIcon
              src={chapter.CharacterIcon}
              alt={isEvent ? chapter.Event_CategoryName : chapter.ChapterName}
              className="h-12 w-12 rounded-md"
              borderClassName="rounded-md"
              withInsetBorder={true}
            />
            <OcticonChevronRight24
              className={cn(
                "hidden h-8 w-8 -translate-x-12 opacity-0 transition-all md:inline-block",
                "group-hover:translate-x-0 group-hover:opacity-50",
                "group-focus:translate-x-0 group-focus:opacity-50"
              )}
            />
          </div>
          <div className="flex flex-col gap-1 text-slate-500">
            {!isEvent && (
              <p className="text-sm font-semibold">
                第{chapter.Chapter_IDX}区域
              </p>
            )}
            <p className="font-bold text-slate-700">
              {isEvent ? chapter.Event_CategoryName : chapter.ChapterName}
            </p>
            {isEvent && <p className="text-sm">{chapter.Event_CategoryDesc}</p>}
          </div>
        </a>
      );
    })}
  </div>
);
