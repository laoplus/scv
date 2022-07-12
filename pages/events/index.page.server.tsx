import _ from "lodash";
import { tables } from "../serverUtil";

import { getScenarioFilenames } from "../serverUtil";

export type EventStories = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["eventStories"];

// filter unreleased events

export const publicEvents = tables.events.filter(
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

export async function onBeforeRender() {
  const { chapters, stages } = tables;

  // TODO: omit unused keys

  // eventsにchapterつめる
  const eventsWithStages = publicEvents.map((e) => {
    const ChapterStages = stages
      .filter((stage) => stage.ChapterIndex === e.Chapter_Key)
      .map((stage) => ({
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
      Chapter_Name: chapters.find((c) => c.Key === e.Chapter_Key)?.ChapterName,
      ChapterStages: ChapterStages,
    };
  });
  // console.log(eventsWithStages);

  const groupedEvents = _.chain(eventsWithStages)
    .groupBy((c) => c.Event_Category)
    .toArray()
    .value();

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

// /scenes にはURLパラメータがないのでprerender()は必要ない
