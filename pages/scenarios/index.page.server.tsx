import fs from "fs/promises";
import type { TableMapChapter } from "./types/Table_MapChapter";
import type { TableMapStage } from "./types/Table_MapStage";

import { getScenarioFilenames } from "./util";

export type Hoge = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"]["hoge"];

export async function onBeforeRender() {
  const ChaptersObj = JSON.parse(
    await fs.readFile("data/tables/_Table_MapChapter.json", "utf8")
  ) as TableMapChapter;
  const Chapters = Object.entries(ChaptersObj).map(([key, value]) => value);

  const StagesObj = JSON.parse(
    await fs.readFile("data/tables/_Table_MapStage.json", "utf8")
  ) as TableMapStage;
  const Stages = Object.entries(StagesObj).map(([key, value]) => value);

  const hoge = Chapters.map((chapter) => {
    const ChapterStages = Stages.filter(
      (stage) => stage.ChapterIndex === chapter.Key
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
    }));

    return {
      ChapterName: chapter.ChapterName,
      GameModeType: chapter.GameModeType,
      EventCategory: chapter.Event_Category,
      Stages: ChapterStages,
    };
  })
    // hide not translated chapters
    .filter((c) => !c.ChapterName.includes("Need a translation Key"))
    // hide empty (unreleased) chapters
    .filter((c) => c.Stages.length > 0)
    // hide not main or event chapters
    .filter((c) => c.GameModeType === 0 || c.GameModeType === 4);

  console.log(hoge);

  const files = await getScenarioFilenames();

  return {
    pageContext: {
      pageProps: {
        ss: files,
        hoge,
      },
    },
  };
}

// /scenarios にはURLパラメータがないのでprerender()は必要ない
