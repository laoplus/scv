import type { PageContextBuiltIn } from "vike/types";

import {
  createSceneCharacters,
  getSceneCharacters,
  tables,
} from "../../serverUtil";

export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  const sceneCharacters = await createSceneCharacters();

  const chapters = tables.chapters.filter(
    (c) => c.ChapterSearch_IDX === routeParams.chapterIndex,
  );

  if (chapters.length === 0) {
    throw new Error("Chapter not found");
  }

  const stages = chapters.map((chapter) =>
    tables.stages
      .filter((stage) => stage.ChapterIndex === chapter.Key)
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
          }),
        ),
        hasCutscene:
          stage.StartCutsceneIndex !== "0" ||
          stage.EndCutsceneIndex !== "0" ||
          stage.MidCutsceneIndex[0] !== "0",
      })),
  );

  return {
    pageContext: {
      pageProps: {
        chapters: chapters.map((chapter, i) => ({
          ...chapter,
          ChapterStages: stages[i],
        })),
      },
    },
  };
}

export const onBeforePrerenderStart = async () => {
  const chapters = tables.chapters.filter((c) => c.GameModeType === 0);

  const chapterIndex = [...new Set(chapters.map((e) => e.Chapter_IDX))];
  return chapterIndex.map((i) => `/main/${i}`);
};
