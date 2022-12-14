import _ from "lodash-es";
import { PageContextBuiltIn } from "vite-plugin-ssr";
import {
  createSceneCharacters,
  getSceneCharacters,
  tables,
} from "../serverUtil";

export type EventStories = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["eventStories"];

// filter unreleased events

const bannedEventChapter = [
  "Chapter_02Ev14",
  "Chapter_01Ev15",
  "Chapter_01Ev16",
];

export const publicEvents = tables.events.filter(
  (c) => !bannedEventChapter.includes(c.Chapter_Key)
);

export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  console.log(routeParams);
  const { chapters, stages } = tables;
  const sceneCharacters = await createSceneCharacters();

  // TODO: omit unused keys

  const event = publicEvents.filter(
    (e) => e.Event_CategoryIndex === Number(routeParams.eventIndex)
  );

  if (!event) {
    return {
      pageContext: {
        pageProps: {
          eventStories: [],
        },
      },
    };
  }

  // eventsにchapterつめる
  const eventsWithStages = event
    .map((e) => {
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
          StartCutsceneCharcters: getSceneCharacters({
            sceneCharacters,
            cutsceneIndex: stage.StartCutsceneIndex,
          }),
          EndCutsceneIndex: stage.EndCutsceneIndex,
          EndCutsceneCharcters: getSceneCharacters({
            sceneCharacters,
            cutsceneIndex: stage.EndCutsceneIndex,
          }),
          MidCutsceneIndex: stage.MidCutsceneIndex,
          MidCutsceneCharcters: stage.MidCutsceneIndex.map((cutsceneIndex) =>
            getSceneCharacters({
              sceneCharacters,
              cutsceneIndex,
            })
          ),
          hasCutscene:
            stage.StartCutsceneIndex !== "0" ||
            stage.EndCutsceneIndex !== "0" ||
            stage.MidCutsceneIndex[0] !== "0",
        }))
        // not include no cutscene stages
        .filter((stage) => stage.hasCutscene);

      return {
        ...e,
        Chapter_Name: chapters.find((c) => c.Key === e.Chapter_Key)
          ?.ChapterName,
        ChapterStages: ChapterStages,
      };
    })
    // not include no cutscene events;
    .filter((e) => e.ChapterStages.length > 0);

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

export const prerender = async () => {
  const eventIndex = [
    ...new Set(publicEvents.map((e) => e.Event_CategoryIndex)),
  ];
  return eventIndex.map((i) => `/events/${i}`);
};
