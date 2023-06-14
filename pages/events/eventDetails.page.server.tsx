import _ from "lodash-es";
import { PageContextBuiltIn } from "vite-plugin-ssr";

import {
  createSceneCharacters,
  extractChapterIndexFromChapterKey,
  getSceneCharacters,
  tables,
} from "../serverUtil";

export type EventStories = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["eventStories"];

// filter unreleased events

const bannedEventChapter: string[] = [
  /** 10章 */
  "Ch10",
  "Ev18",
  "Ev19",
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
          subStoryGroups: [],
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

  const subStoryGroups = _.flatten(
    event.map((e) => {
      const subStoryGroup = tables.chapterSubStoryGroups
        .filter((s) => s.ChapterIndex === e.Chapter_Key)
        .map((sgroup) => {
          const unitName = sgroup.Key.split("_").at(-1);
          const eventIndex = e.Event_CategoryIndex;
          const chapterIndex = extractChapterIndexFromChapterKey(e.Chapter_Key);

          return {
            ...sgroup,
            SubStory: sgroup.ChapterSubStoryIndex.map((subStoryIndex) =>
              tables.chapterSubStories.find(
                (subStory) => subStory.Key === subStoryIndex
              )
            ).map((subStory, index) => {
              if (!subStory) {
                return null;
              }
              return {
                StoryName: subStory.StoryName,
                StoryPath:
                  `/scenes/ev${eventIndex}/sub/${chapterIndex}/${unitName}/${
                    index + 1
                  }/`.toLowerCase(),
                Characters: getSceneCharacters({
                  sceneCharacters,
                  cutsceneIndex: subStory.StoryDialog,
                }),
              } as const;
            }),
          };
        });

      return subStoryGroup;
    })
  );

  return {
    pageContext: {
      pageProps: {
        eventStories: groupedEvents,
        subStoryGroups,
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
