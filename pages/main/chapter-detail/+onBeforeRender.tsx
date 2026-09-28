import type { PageContextServer } from "vike/types";

import { createSceneCharacters, getSceneCharacters, tables } from "../../serverUtil";

export async function onBeforeRender({ routeParams }: PageContextServer) {
    const sceneCharacters = await createSceneCharacters();

    const chapters = tables.chapters.filter(
        (c) => c.ChapterSearch_IDX === routeParams["chapterIndex"],
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
                        default:
                            return undefined;
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
                chapters: chapters.map((chapter, i) => {
                    const chapterStages = stages[i];
                    if (!chapterStages) throw new Error("Missing chapter stages");
                    return { ...chapter, ChapterStages: chapterStages };
                }),
            },
        },
    };
}
