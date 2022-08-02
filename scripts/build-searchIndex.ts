import fs from "fs/promises";
import type { Scene } from "../pages/types/Scene";

type Index = {
    filename: string;
    speaker: {
        name: string;
        icon: string;
    };
    script: string;
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

            index.push({
                filename: dialog["Key"],
                speaker: speaker || { name: "unknown", icon: "" },
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
