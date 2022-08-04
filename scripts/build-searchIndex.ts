import fs from "fs/promises";
import type { Scene } from "../pages/types/Scene";
import type { EventChapter } from "../pages/types/Table_EventChapter";
import type { Chapter } from "../pages/types/Table_MapChapter";
import { tables } from "../pages/serverUtil";

type Index = {
    filename: string;
    speaker: {
        name: string;
        icon: string;
    };
    sceneName: string;
    script: string;
};

const isEventChapter = (
    chapter: EventChapter | Chapter
): chapter is EventChapter => {
    return true;
};
(async () => {
    // ワーキングディレクトリからの相対パス
    // 通常、プロジェクトルート
    const dialogsPath = `./data/dialogs`;
    const bannedKeywordFilename = [
        "Ev11",
        "Ev13",
        "Ev14",
        "Ev15",
        "Ev16",
        "Ch09Stage",
        "ChCS",
        "TEST",
        "Roguelike",
        "Marriage",
        "Tuto",
    ];
    const filenames = (await fs.readdir(dialogsPath)).filter((file) => {
        return !bannedKeywordFilename.some((keyword) => file.includes(keyword));
    });
    const scenes = await Promise.all(
        filenames.map(async (file) => {
            const data = await fs.readFile(`${dialogsPath}\\${file}`, "utf-8");
            return JSON.parse(data) as Scene;
        })
    );

    // create index
    const index: Index[] = [];
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

                const chapter =
                    tables.events.find(
                        (c) => c.Chapter_Key === stage?.ChapterIndex
                    ) ||
                    tables.chapters.find((c) => c.Key === stage?.ChapterIndex);

                return {
                    chapter,
                    stage,
                    includedIn:
                        stage?.StartCutsceneIndex === cutscene.Key
                            ? "OP"
                            : stage?.EndCutsceneIndex === cutscene.Key
                            ? "ED"
                            : "MID",
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
                if (!info.chapter) {
                    return "Unknown";
                }
                if ("ChapterName" in info.chapter) {
                    return "メインストーリー";
                }
                return info.chapter.Event_CategoryName;
            })();

            index.push({
                filename: dialog["Key"],
                speaker: speaker || { name: "unknown", icon: "" },
                sceneName: info
                    ? `${chapterName} ${info.stage?.StageIdxString} ${info.includedIn}`
                    : "unknown",
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
