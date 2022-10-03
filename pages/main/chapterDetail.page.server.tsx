import {
  createSceneCharacters,
  getSceneCharacters,
  tables,
} from "../serverUtil";
import _ from "lodash-es";
import { PageContextBuiltIn } from "vite-plugin-ssr";

export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  console.log(routeParams);
  const { chapters, stages } = tables;
  const sceneCharacters = await createSceneCharacters();

  const chapter = chapters.find(
    (c) =>
      c.GameModeType === 0 && c.Chapter_IDX === Number(routeParams.chapterIndex)
  );

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const ChapterStages = stages
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
        })
      ),
      hasCutscene:
        stage.StartCutsceneIndex !== "0" ||
        stage.EndCutsceneIndex !== "0" ||
        stage.MidCutsceneIndex[0] !== "0",
    }));

  return {
    pageContext: {
      pageProps: {
        chapter: {
          ...chapter,
          ChapterStages: ChapterStages,
        },
      },
    },
  };
}

export const prerender = async () => {
  const chapters = tables.chapters.filter((c) => c.GameModeType === 0);

  const chapterIndex = [...new Set(chapters.map((e) => e.Chapter_IDX))];
  return chapterIndex.map((i) => `/main/${i}`);
};
