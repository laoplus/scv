import { PageContextBuiltIn } from "vite-plugin-ssr";
import { publicEvents } from "../events/eventDetails.page.server";
import { getDialogFromCutName, loadScene, tables } from "../serverUtil";
import { Stage } from "../types/Table_MapStage";

type SceneType = "op" | "ed" | `mid${number}`;

export function isSceneType(type: string): type is SceneType {
  return type === "op" || type === "ed" || type.startsWith("mid");
}

export function getCutInfoFromParam({
  chapter,
  stageIdxStr,
  sceneType,
}: {
  chapter: string;
  stageIdxStr: string;
  sceneType: SceneType;
}) {
  let stage: Stage;

  const cutMeta = {
    stageName: "",
    stageDescription: "",
    stageIdx: "",
    eventName: "",
    cutType: sceneType.toUpperCase().replace("MID", "Mid "),
  };

  if (chapter === "main") {
    cutMeta.eventName = "メインストーリー";
    const s = tables.stages.find(
      (s) => s.StageIdxString.toLowerCase() === stageIdxStr
    );
    if (!s) {
      throw new Error(`no stage found for ${stageIdxStr}`);
    }
    stage = s;
  } else {
    const eventNumber = Number(chapter.replace("ev", ""));
    const eventChapters = tables.events.filter(
      (e) => e.Event_CategoryPos === eventNumber
    );
    cutMeta.eventName = eventChapters[0].Event_CategoryName;
    const eventChaptersString = eventChapters.map((e) => e.Chapter_Key);
    let found;

    eventChaptersString.forEach((chapterKey) => {
      const result = tables.stages.find(
        (s) =>
          s.ChapterIndex === chapterKey &&
          s.StageIdxString.toLowerCase() === stageIdxStr
      );
      if (result) {
        found = result;
      }
    });

    if (!found) {
      throw new Error(`no stage found for ${stageIdxStr}`);
    }
    stage = found;
  }

  cutMeta.stageName = stage.StageName;
  cutMeta.stageDescription = stage.StageDesc;
  cutMeta.stageIdx = stage.StageIdxString;

  switch (sceneType) {
    case "op":
      return {
        ...cutMeta,
        cutSceneIndex: stage.StartCutsceneIndex,
      };
    case "ed":
      return {
        ...cutMeta,
        cutSceneIndex: stage.EndCutsceneIndex,
      };
    default:
      const index = Number(sceneType.slice(3));
      return {
        ...cutMeta,
        cutSceneIndex: stage.MidCutsceneIndex[index - 1],
      };
  }
}

// このページで表示する詳細を取得する
export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  console.log(routeParams);
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
