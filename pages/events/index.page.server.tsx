import _ from "lodash";
import {
  getCutNameFromParam,
  getDialogFromCutName,
  isSceneType,
} from "../scenes/view.page.server";
import { createSceneCharacters, SceneCharacters, tables } from "../serverUtil";

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

const getSceneCharacters = ({
  sceneCharacters,
  cutsceneIndex,
}: {
  sceneCharacters: SceneCharacters;
  cutsceneIndex: string;
}) => {
  if (
    cutsceneIndex === "0" ||
    (cutsceneIndex.length === 1 && cutsceneIndex[0] === "0")
  ) {
    return [];
  }

  const dialog = getDialogFromCutName(cutsceneIndex);
  const charcters = sceneCharacters.find((s) => s.Cutscene_Key === dialog.Key);
  return charcters?.characters || [];
};

export async function onBeforeRender() {
  const { chapters, stages } = tables;
  const sceneCharacters = await createSceneCharacters();

  // TODO: omit unused keys

  // eventsにchapterつめる
  const eventsWithStages = publicEvents.map((e) => {
    const ChapterStages = stages
      .filter((stage) => stage.ChapterIndex === e.Chapter_Key)
      .map((stage) => ({
        StageName: stage.StageName,
        StageDesc: stage.StageDesc,
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
        StartCutsceneCharcters: getSceneCharacters({
          sceneCharacters,
          cutsceneIndex: stage.StartCutsceneIndex,
        }),
        EndCutsceneCharcters: getSceneCharacters({
          sceneCharacters,
          cutsceneIndex: stage.EndCutsceneIndex,
        }),
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

  return {
    pageContext: {
      pageProps: {
        eventStories: groupedEvents,
      },
    },
  };
}

// /scenes にはURLパラメータがないのでprerender()は必要ない
