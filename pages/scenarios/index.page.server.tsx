import fs from "fs/promises";
import type { TableMapChapter } from "./types/Table_MapChapter";
import type { TableMapStage } from "./types/Table_MapStage";
import type { TableEventChapter } from "./types/Table_EventChapter";
import _ from "lodash";

import { getScenarioFilenames } from "./util";

export type EventStories = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["eventStories"];

export async function onBeforeRender() {
  const EventsObj = JSON.parse(
    await fs.readFile("data/tables/_Table_EventChapter.json", "utf-8")
  ) as TableEventChapter;
  const Events = Object.entries(EventsObj).map(([key, value]) => value);

  const ChaptersObj = JSON.parse(
    await fs.readFile("data/tables/_Table_MapChapter.json", "utf8")
  ) as TableMapChapter;
  const Chapters = Object.entries(ChaptersObj).map(([key, value]) => value);

  const StagesObj = JSON.parse(
    await fs.readFile("data/tables/_Table_MapStage.json", "utf8")
  ) as TableMapStage;
  const Stages = Object.entries(StagesObj).map(([key, value]) => value);

  // TODO: omit unused keys

  // filter unreleased events
  const publicEvents = Events.filter(
    (c) =>
      ![
        "Open_Event11",
        "Open_Event12",
        "Open_Event13",
        "Open_Event14",
        "Open_Event15",
        "Open_Event16",
      ].includes(c.Event_Category)
  );

  // eventsにchapterつめる
  const eventsWithStages = publicEvents.map((e) => {
    const ChapterStages = Stages.filter(
      (stage) => stage.ChapterIndex === e.Chapter_Key
    ).map((stage) => ({
      StageName: stage.StageName,
      StageIdxString: stage.StageIdxString,
      StageSubType: stage.StageSubType,
      StageSubTypeStr: (() => {
        switch (stage.StageSubType) {
          case 0:
            return "NORMAL" as const;
          case 1:
            return "SUB" as const;
          case 2:
            return "EX" as const;
        }
      })(),
      StagePos: stage.Stage_Pos,
      StartCutsceneIndex: stage.StartCutsceneIndex,
      EndCutsceneIndex: stage.EndCutsceneIndex,
      MidCutsceneIndex: stage.MidCutsceneIndex,
      hasCutscene:
        stage.StartCutsceneIndex !== "0" ||
        stage.EndCutsceneIndex !== "0" ||
        stage.MidCutsceneIndex[0] !== "0",
    }));

    return {
      ...e,
      Chapter_Name: Chapters.find((c) => c.Key === e.Chapter_Key)?.ChapterName,
      ChapterStages: ChapterStages,
    };
  });
  // console.log(eventsWithStages);

  const groupedEvents = _.chain(eventsWithStages)
    .groupBy((c) => c.Event_Category)
    .toArray()
    .value();
  // console.log(groupedEvents);

  // const hoge = Chapters.map((chapter) => {
  //   return {
  //     ChapterName: chapter.ChapterName,
  //     GameModeType: chapter.GameModeType,
  //     EventCategory: chapter.Event_Category,
  //     Stages: [],
  //   };
  // })
  //   // hide not translated chapters
  //   .filter((c) => !c.ChapterName.includes("Need a translation Key"))
  //   // hide empty (unreleased) chapters
  //   .filter((c) => c.Stages.length > 0)
  //   // hide not main or event chapters
  //   .filter((c) => c.GameModeType === 0 || c.GameModeType === 4);

  const files = await getScenarioFilenames();

  return {
    pageContext: {
      pageProps: {
        ss: files,
        eventStories: groupedEvents,
      },
    },
  };
}

// /scenarios にはURLパラメータがないのでprerender()は必要ない
