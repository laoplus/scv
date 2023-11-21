import React from "react";

import { StageGridTable, SubStoryGridTable } from "../../components/GridTable";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./eventDetails.page.server";

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];

export function getDocumentProps({ pageProps: { eventStories } }: PageContext) {
  return {
    title: ["イベントストーリー", eventStories[0][0].Event_CategoryName].join(
      " ",
    ),
    description: "「" + eventStories[0][0].Event_CategoryDesc + "」",
  };
}

export function Page({
  eventStories,
  subStoryGroups,
}: PageContext["pageProps"]) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <Heading level={1}>
        <span>{eventStories[0][0].Event_CategoryName}</span>
      </Heading>
      <div
        key={eventStories[0][0].Event_Category}
        id={`ev${eventStories[0][0].Event_CategoryIndex}`}
        className="flex flex-col gap-8"
      >
        {eventStories.map((event) =>
          event.map((chapter) =>
            chapter.ChapterStages.every((s) => !s.hasCutscene) ? undefined : ( // 全てのステージがシーンなしの場合
              <div
                key={chapter.Chapter_Name}
                className="flex flex-col gap-6 px-4 md:px-0"
              >
                {event.length !== 1 && (
                  <h2 className="text-2xl">{chapter.Chapter_Name}</h2>
                )}

                <StageGridTable
                  eventIndexStr={`ev${event[0].Event_CategoryIndex}`}
                  stages={chapter.ChapterStages}
                />
              </div>
            ),
          ),
        )}

        {subStoryGroups.length !== 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl">サブストーリー</h2>

            <div className="flex flex-col gap-6 px-4 md:px-0">
              {subStoryGroups.map((subStoryGroup) => (
                <div key={subStoryGroup.Key} className="flex flex-col gap-2">
                  <h3 className="text-xl">{subStoryGroup.PCName}</h3>
                  <SubStoryGridTable subStoryGroup={subStoryGroup} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
