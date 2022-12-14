import fs from "fs/promises";
import type { Scene } from "../pages/types/Scene";
import { tables } from "../pages/serverUtil";
import type { SearchIndex } from "../pages/search/index.page";

(async () => {
    // ワーキングディレクトリからの相対パス
    // 通常、プロジェクトルート
    const dialogsPath = `./data/dialogs`;
    /**
     * 公開してはいけないファイル名（部分一致）
     */
    const bannedKeywordFilename = [
        "Ch01Ev14Stage11",
        "Ch01Ev14Stage12",
        "Ch01Ev14Stage13",
        "Ch01Ev14Stage14",
        "Ch01Ev14Stage15",
        "Ch01Ev14Stage16",
        "Ch01Ev14Stage17",
        "Ch01Ev14Stage18",
        "Ch01Ev14Stage06b",
        "Ch01Ev14Stage07b",
        "Ch01Ev14Stage08b",
        "Ch01Ev14Stage09b",
        "Ch01Ev14Stage04Ex",
        "Ch01Ev14Stage05Ex",
        "Ch01Ev14Stage06Ex",
        "Ch01Ev14Stage19",
        "Ch02Ev14",
        "Ev15",
        "Ev16",
        /** 外伝 */
        "ChCS",
        "SysOP",
        "TEST",
        "Marriage",
        "SubStory",
    ];
    const filenames = (await fs.readdir(dialogsPath)).filter((file) => {
        return !bannedKeywordFilename.some((keyword) => file.includes(keyword));
    });
    const scenes = await Promise.all(
        filenames.map(async (file) => {
            const data = await fs.readFile(`${dialogsPath}/${file}`, "utf-8");
            return JSON.parse(data) as Scene;
        })
    );

    // create index
    const index: SearchIndex[] = [];
    for (const scene of scenes) {
        for (const dialog of scene) {
            if (dialog.Script === "") {
                continue;
            }
            const info = (() => {
                const cutscene = tables.cutScenes.find(
                    (c) => c.FileName === dialog.Dialog_Group
                );
                if (cutscene === undefined) {
                    throw new Error("cutscene not found");
                }

                const stage = tables.stages.find(
                    (s) =>
                        cutscene?.Key === s.StartCutsceneIndex ||
                        cutscene?.Key === s.EndCutsceneIndex ||
                        s.MidCutsceneIndex.includes(cutscene?.Key)
                );
                if (stage === undefined) {
                    throw new Error(
                        `stage not found for ${dialog.Dialog_Group} / ${cutscene?.Key}`
                    );
                }

                const chapter =
                    tables.events.find(
                        (c) => c.Chapter_Key === stage?.ChapterIndex
                    ) ||
                    tables.chapters.find((c) => c.Key === stage?.ChapterIndex);
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
                              stage?.MidCutsceneIndex.indexOf(cutscene.Key)! + 1
                          }`;

                const chapterName = (() => {
                    if ("ChapterName" in chapter) {
                        return "main";
                    } else {
                        const index = tables.events.find(
                            (e) => e.Chapter_Key === chapter.Chapter_Key
                        )?.Event_CategoryIndex;
                        if (index === undefined) {
                            throw new Error("chapter not found");
                        }
                        return `ev${index}`;
                    }
                })();

                return {
                    chapter,
                    stage,
                    includedIn,
                    chapterName,
                };
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

            const chapterName = (() => {
                if ("ChapterName" in info.chapter) {
                    return "メインストーリー";
                }
                return info.chapter.Event_CategoryName;
            })();

            index.push({
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
                sceneName: info
                    ? `${chapterName} ${info.stage?.StageIdxString} ${info.includedIn}`
                    : "unknown",
                path:
                    "/scenes" +
                    `/${info.chapterName}/${info.stage.StageIdxString}/${info.includedIn}/`.toLowerCase(),
                script: dialog["Script"],
            });
        }
    }

    await fs.writeFile(
        "./public/searchIndex.json",
        JSON.stringify(index, null, 2),
        "utf-8"
    );
    console.log(`done with ${index.length} dialogs`);
})();
