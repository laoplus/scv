import { tables } from "../serverUtil";
import _ from "lodash";

export async function onBeforeRender() {
  const { chapters, stages } = tables;

  const mapChapters = chapters.filter((c) => c.GameModeType === 0);

  // eventsにchapterつめる
  const chaptersWithStages = mapChapters.map((c) => {
    const ChapterStages = stages
      .filter((stage) => stage.ChapterIndex === c.Key)
      .map((stage) => ({
        StageName: stage.StageName,
        StageIdxString: stage.StageIdxString,
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
        StartCutsceneCharcters: [],
        EndCutsceneIndex: stage.EndCutsceneIndex,
        EndCutsceneCharcters: [],
        MidCutsceneIndex: stage.MidCutsceneIndex,
        hasCutscene:
          stage.StartCutsceneIndex !== "0" ||
          stage.EndCutsceneIndex !== "0" ||
          stage.MidCutsceneIndex[0] !== "0",
      }));

    return {
      ...c,
      ChapterStages: ChapterStages,
    };
  });

  // console.log(chaptersWithStages);

  return {
    pageContext: {
      pageProps: {
        chapteres: chaptersWithStages,
      },
    },
  };
}
