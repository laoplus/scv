import { PageContextBuiltIn } from "vite-plugin-ssr";
import { publicEvents } from "../events/eventDetails.page.server";
import { getDialogFromCutName, loadScene, tables } from "../serverUtil";
import { Stage } from "../types/Table_MapStage";
import { getCutInfoFromParam, isSceneType } from "./viewUtil";

// このページで表示する詳細を取得する
export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  const { chapter, stageIdxStr, sceneType } = routeParams;

  if (!isSceneType(sceneType)) {
    throw new Error("invalid sceneType");
  }

  const cutInfo = getCutInfoFromParam({
    chapter,
    stageIdxStr,
    sceneType,
  });
  const dialog = getDialogFromCutName(cutInfo.cutSceneIndex);
  const scene = await loadScene(dialog.FileName + ".json");

  return {
    pageContext: {
      pageProps: {
        scene,
      },
      documentProps: {
        title: [
          cutInfo.eventName,
          cutInfo.stageIdx,
          cutInfo.stageName,
          cutInfo.cutType,
        ].join(" "),
        description: "「" + cutInfo.stageDescription + "」",
      },
    },
  };
}

export async function prerender() {
  let stages: (Stage & { chapter: string })[] = [];
  let pathList: string[] = [];

  publicEvents.forEach((event) => {
    const eventStages = tables.stages.filter(
      (s) => s.ChapterIndex === event.Chapter_Key
    );
    stages = [
      ...stages,
      ...eventStages.map((stage) => ({
        chapter: `ev${event.Event_CategoryPos}`,
        ...stage,
      })),
    ];
  });

  const mainChapters = tables.chapters
    .filter((c) => c.GameModeType === 0)
    .map((c) => c.Key);
  mainChapters.forEach((chapter) => {
    const mainStages = tables.stages.filter((s) => s.ChapterIndex === chapter);
    stages = [
      ...stages,
      ...mainStages.map((stage) => ({
        chapter: "main",
        ...stage,
      })),
    ];
  });

  stages.forEach((stage) => {
    if (stage.StartCutsceneIndex !== "0") {
      pathList.push(
        `/scenes/${stage.chapter}/${stage.StageIdxString}/op`.toLowerCase()
      );
    }
    if (stage.EndCutsceneIndex !== "0") {
      pathList.push(
        `/scenes/${stage.chapter}/${stage.StageIdxString}/ed`.toLowerCase()
      );
    }
    if (stage.MidCutsceneIndex[0] !== "0") {
      stage.MidCutsceneIndex.forEach((_mid, i) => {
        pathList.push(
          `/scenes/${stage.chapter}/${stage.StageIdxString}/mid${
            i + 1
          }`.toLowerCase()
        );
      });
    }
  });

  return pathList;
}
