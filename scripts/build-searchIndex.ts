import fs from "fs/promises";

import type { SearchIndex } from "../pages/search/+Page";
import { extractChapterIndexFromChapterKey, tables } from "../pages/serverUtil";
import type { Scene } from "../pages/types/Scene";
import { ChapterSubStory } from "../pages/types/Table_ChapterSubStory";
import { ChapterSubStoryGroup } from "../pages/types/Table_ChapterSubStoryGroup";
import type { EventChapter } from "../pages/types/Table_EventChapter";
import type { Chapter } from "../pages/types/Table_MapChapter";
import type { Stage } from "../pages/types/Table_MapStage";

type StageStoryInfo = {
    type: "stageStory";
    chapter: Chapter | EventChapter;
    stage: Stage;
    includedIn: string;
};

type SubStoryInfo = {
    type: "subStory";
    subStory: ChapterSubStory;
    subStoryGroup: ChapterSubStoryGroup;
    event: EventChapter;
};

(async () => {
    // ワーキングディレクトリからの相対パス
    // 通常、プロジェクトルート
    const dialogsPath = `./data/dialogs`;
    /**
     * 公開してはいけないファイル名（部分一致）
     */
    const bannedKeywordFilename = [
        "Ev20",
        "Ev21",
        /** 外伝 */
        "ChCS",
        "SysOP",
        "TEST",
        "Marriage",
        "DG_DamagedSeverely",
    ];
    const filenames = (await fs.readdir(dialogsPath)).filter((file) => {
        return !bannedKeywordFilename.some((keyword) => file.includes(keyword));
    });
    const scenes = await Promise.all(
        filenames.map(async (file) => {
            const data = await fs.readFile(`${dialogsPath}/${file}`, "utf-8");
            return JSON.parse(data) as Scene;
        }),
    );

    // create index
    const searchIndexes: SearchIndex[] = [];
    for (const scene of scenes) {
        for (const dialog of scene) {
            if (dialog.Script === "") {
                continue;
            }

            // 日本版追加要素の暫定対応
            // /pages/scenes/view.page.tsx も参照
            if (!dialog.Key.includes(dialog.Dialog_Group)) {
                continue;
            }

            try {
                const info: StageStoryInfo | SubStoryInfo = (() => {
                    const cutscene = tables.cutScenes.find(
                        (c) => c.FileName === dialog.Dialog_Group,
                    );
                    if (cutscene === undefined) {
                        throw new Error("cutscene not found");
                    }

                    const stage = tables.stages.find(
                        (s) =>
                            cutscene?.Key === s.StartCutsceneIndex ||
                            cutscene?.Key === s.EndCutsceneIndex ||
                            s.MidCutsceneIndex.includes(cutscene?.Key),
                    );

                    const subStory = tables.chapterSubStories.find(
                        (s) => cutscene.Key === s.StoryDialog,
                    );

                    if (stage === undefined && subStory === undefined) {
                        throw new Error(
                            `neither stage nor subStory found for ${dialog.Dialog_Group} / ${cutscene?.Key} \nScript bug or not implemented yet?`,
                        );
                    }

                    if (stage) {
                        const chapter =
                            tables.events.find(
                                (c) => c.Chapter_Key === stage?.ChapterIndex,
                            ) ||
                            tables.chapters.find(
                                (c) => c.Key === stage?.ChapterIndex,
                            );
                        if (chapter === undefined) {
                            throw new Error("chapter not found");
                        }

                        const includedIn =
                            stage?.StartCutsceneIndex === cutscene.Key
                                ? "OP"
                                : stage?.EndCutsceneIndex === cutscene.Key
                                  ? "ED"
                                  : `Mid${
                                        // s.MidCutsceneIndex.includes(cutscene?.Key) で取得しているのであることは確実
                                        stage?.MidCutsceneIndex.indexOf(
                                            cutscene.Key,
                                        ) + 1
                                    }`;

                        return {
                            type: "stageStory",
                            chapter,
                            stage,
                            includedIn,
                        } as const;
                    }

                    if (subStory) {
                        const subStoryGroup = tables.chapterSubStoryGroups.find(
                            (g) =>
                                g.ChapterSubStoryIndex.includes(subStory.Key),
                        );

                        const event = tables.events.find(
                            (e) =>
                                e.Chapter_Key === subStoryGroup?.ChapterIndex,
                        );

                        if (
                            subStoryGroup === undefined ||
                            event === undefined
                        ) {
                            throw new Error("subStoryGroup or event not found");
                        }

                        return {
                            type: "subStory",
                            subStory,
                            subStoryGroup,
                            event,
                        } as const;
                    }

                    throw new Error("unreachable");
                })();

                const speaker = [
                    {
                        name: dialog.Char_Name_L,
                        icon: dialog.Char_ImageVarName_L,
                        speaking: dialog.Dialog_Speaker === 0 ? true : false,
                    },
                    {
                        name: dialog.Char_Name_R,
                        icon: dialog.Char_ImageVarName_R,
                        speaking: dialog.Dialog_Speaker === 1 ? true : false,
                    },
                    {
                        name: dialog.Char_Name_C,
                        icon: dialog.Char_ImageVarName_C,
                        speaking: dialog.Dialog_Speaker === 2 ? true : false,
                    },
                ].find((c) => c.speaking);
                if (speaker?.name === "主人公") {
                    speaker.icon = "";
                }

                const [chapterName, chapterPath]: [
                    string,
                    "main" | `ev${number}`,
                ] = (() => {
                    if (info.type === "stageStory") {
                        if ("ChapterName" in info.chapter) {
                            return ["メインストーリー", "main"];
                        }
                        return [
                            info.chapter.Event_CategoryName,
                            `ev${info.chapter.Event_CategoryIndex}`,
                        ];
                    }

                    if (info.type === "subStory") {
                        return [
                            info.event.Event_CategoryName,
                            `ev${info.event.Event_CategoryIndex}`,
                        ];
                    }

                    throw new Error("unreachable");
                })();

                const searchIndexBase = {
                    key: dialog["Key"],
                    speaker: {
                        name:
                            speaker === undefined || speaker.name === ""
                                ? null
                                : speaker.name,
                        icon:
                            speaker === undefined || speaker.icon === ""
                                ? null
                                : speaker.icon,
                    },
                    script: dialog["Script"],
                };

                const index: SearchIndex = (() => {
                    switch (info.type) {
                        case "stageStory": {
                            return {
                                ...searchIndexBase,
                                sceneName: `${chapterName} ${info.stage?.StageIdxString} ${info.includedIn}`,
                                path: [
                                    "/scenes",
                                    chapterPath,
                                    info.stage.StageIdxString,
                                    info.includedIn,
                                    "", // for trailing slash
                                ]
                                    .join("/")
                                    .toLowerCase(),
                            };
                        }
                        case "subStory": {
                            const eventIndex = info.event.Event_CategoryIndex;
                            const chapterIndex =
                                extractChapterIndexFromChapterKey(
                                    info.event.Chapter_Key,
                                );
                            const unitName =
                                info.subStoryGroup.Key.split("_").at(-1);
                            const subStoryIndex =
                                info.subStoryGroup.ChapterSubStoryIndex.indexOf(
                                    info.subStory.Key,
                                ) + 1;

                            return {
                                ...searchIndexBase,
                                sceneName: [
                                    chapterName,
                                    "サブストーリー",
                                    info.subStory.StoryName,
                                ].join(" "),
                                path: [
                                    "/scenes",
                                    `ev${eventIndex}`,
                                    "sub",
                                    chapterIndex,
                                    unitName,
                                    subStoryIndex,
                                    "", // for trailing slash
                                ]
                                    .join("/")
                                    .toLowerCase(),
                            };
                        }
                    }
                })();

                searchIndexes.push(index);
            } catch (error) {
                console.warn((error as Error).message);
                continue;
            }
        }
    }

    await fs.writeFile(
        "./public/searchIndex.json",
        JSON.stringify(searchIndexes, null, 2),
        "utf-8",
    );
    console.log(`done with ${searchIndexes.length} dialogs`);
})();
