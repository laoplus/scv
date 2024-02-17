import type { PageContextBuiltIn } from "vike/types";

import { publicEvents } from "../events/eventDetails.page.server";
import {
  extractChapterIndexFromChapterKey,
  getDialogFromCutName,
  loadScene,
  tables,
} from "../serverUtil";
import { ChapterSubStoryGroup } from "../types/Table_ChapterSubStoryGroup";
import { Stage } from "../types/Table_MapStage";
import {
  getStoryCutInfoFromParam,
  getSubStoryInfoFromParam,
  isSceneType,
} from "./viewUtil";

// このページで表示する詳細を取得する
export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  const catchAll = routeParams["*"];

  if (catchAll.includes("/sub/")) {
    const regex =
      /ev(?<eventIndex>\d+)\/sub\/(?<chapterIndex>\d+)\/(?<unitName>.+)\/(?<index>\d+)/;
    const match = catchAll.match(regex);
    if (!match || !match.groups) {
      console.error("invalid route", catchAll);
      throw new Error("invalid route");
    }
    const { eventIndex, chapterIndex, unitName, index } = match.groups;

    const { subStory, eventName } = getSubStoryInfoFromParam({
      eventIndex: Number(eventIndex),
      chapterIndex: Number(chapterIndex),
      unitName,
      index: Number(index),
    });
    const dialog = getDialogFromCutName(subStory.StoryDialog);
    const scene = await loadScene(dialog.FileName + ".json");

    return {
      pageContext: {
        pageProps: {
          scene,
        },
        documentProps: {
          title: [eventName, "Sub", subStory.StoryName].join(" "),
          // サブストーリーには説明がない
          description: "",
        },
      },
    };
  }

  const regex =
    /(?<chapter>ev\d+|main)\/(?<stageIdxStr>.+)\/(?<sceneType>op|ed|mid\d+)/;
  const match = catchAll.match(regex);
  if (!match || !match.groups) {
    console.error("invalid route", catchAll);
    throw new Error("invalid route");
  }
  const { chapter, stageIdxStr, sceneType } = match.groups;

  if (!isSceneType(sceneType)) {
    throw new Error("invalid sceneType");
  }

  const cutInfo = getStoryCutInfoFromParam({
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
  let subStoryGroups: (ChapterSubStoryGroup & {
    eventIndex: number;
    chapterIndex: number;
  })[] = [];
  const pathList: string[] = [];

  publicEvents.forEach((event) => {
    const eventStages = tables.stages.filter(
      (s) => s.ChapterIndex === event.Chapter_Key,
    );
    stages = [
      ...stages,
      ...eventStages.map((stage) => ({
        chapter: `ev${event.Event_CategoryPos}`,
        ...stage,
      })),
    ];

    const eventSubStoryGroups = tables.chapterSubStoryGroups.filter(
      (s) => s.ChapterIndex === event.Chapter_Key,
    );
    subStoryGroups = [
      ...subStoryGroups,
      ...eventSubStoryGroups.map((subStoryGroup) => ({
        eventIndex: event.Event_CategoryIndex,
        chapterIndex: extractChapterIndexFromChapterKey(event.Chapter_Key),
        ...subStoryGroup,
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
        `/scenes/${stage.chapter}/${stage.StageIdxString}/op`.toLowerCase(),
      );
    }
    if (stage.EndCutsceneIndex !== "0") {
      pathList.push(
        `/scenes/${stage.chapter}/${stage.StageIdxString}/ed`.toLowerCase(),
      );
    }
    if (stage.MidCutsceneIndex[0] !== "0") {
      stage.MidCutsceneIndex.forEach((_mid, i) => {
        pathList.push(
          `/scenes/${stage.chapter}/${stage.StageIdxString}/mid${
            i + 1
          }`.toLowerCase(),
        );
      });
    }
  });

  subStoryGroups.forEach((subStoryGroup) => {
    subStoryGroup.ChapterSubStoryIndex.forEach((_, index) => {
      const unitName = subStoryGroup.Key.split("_").at(-1);
      pathList.push(
        [
          `/scenes`,
          `ev${subStoryGroup.eventIndex}`,
          `sub`,
          `${subStoryGroup.chapterIndex}`,
          `${unitName}`,
          `${index + 1}`,
          ``,
        ]
          .join("/")
          .toLowerCase(),
      );
    });
  });

  const ignorePaths = [
    // Cut_Ch01Ev13Stage02_3
    "/scenes/ev13/ev1-2/mid1",
  ];
  const newPathList = pathList.filter((path) => !ignorePaths.includes(path));
  // console.log(JSON.stringify(newPathList, null, 2));

  return newPathList;
}
