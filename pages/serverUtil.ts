import fs from "fs";

import { Scene } from "./types/Scene";
import type { TableCutscene } from "./types/Table_Cutscene";
import type { TableEventChapter } from "./types/Table_EventChapter";
import type { TableMapChapter } from "./types/Table_MapChapter";
import type { TableMapStage } from "./types/Table_MapStage";

export const getAllScenesFilenames = async () => {
    const files = await fs.promises.readdir("data/dialogs");
    return files.filter((file) => file.endsWith(".json"));
};

export const loadScene = async (filename: string) => {
    const data = await fs.promises.readFile(`data/dialogs/${filename}`, "utf8");
    return JSON.parse(data) as Scene;
};

const chaptersObj = JSON.parse(
    fs.readFileSync("data/tables/_Table_MapChapter.json", "utf8")
) as TableMapChapter;
const chapters = Object.entries(chaptersObj).map(([, v]) => v);

const cutScenesObj = JSON.parse(
    fs.readFileSync("data/tables/_Table_CutScene.json", "utf8")
) as TableCutscene;
const cutScenes = Object.entries(cutScenesObj).map(([, v]) => v);

const eventsObj = JSON.parse(
    fs.readFileSync("data/tables/_Table_EventChapter.json", "utf-8")
) as TableEventChapter;
const events = Object.entries(eventsObj).map(([, v]) => v);

const stagesObj = JSON.parse(
    fs.readFileSync("data/tables/_Table_MapStage.json", "utf8")
) as TableMapStage;
const stages = Object.entries(stagesObj).map(([, v]) => v);

export const tables = {
    chapters,
    cutScenes,
    events,
    stages,
};

export type SceneCharacters = {
    Cutscene_Key: string;
    Dialog_Group: string;
    characters: {
        name: string;
        image: string;
        counts: number;
    }[];
}[];

export const createSceneCharacters = async () => {
    const sceneFiles = await getAllScenesFilenames();

    const sceneCharcters = [] as unknown as SceneCharacters;

    for (const sceneFilename of sceneFiles) {
        const scene = await loadScene(sceneFilename);
        if (!scene[0]) {
            continue;
        }

        const ignoreImages = [
            "2DModel_BR_PA00EL_Dialog010101",
            "2DModel_3P_ConstantiaS2_Dialog010101",
        ];

        const characters = scene
            .flatMap((d) => {
                return [
                    { name: d.Char_Name_L, image: d.Char_ImageName_L },
                    { name: d.Char_Name_R, image: d.Char_ImageName_R },
                    { name: d.Char_Name_C, image: d.Char_ImageName_C },
                ];
            })
            .filter((c) => c.name !== "" && c.image !== "")
            // .filter((c) => !c.image.includes("_Commu"))
            .filter((c) => !ignoreImages.includes(c.image))
            .filter((c) => c.name !== "主人公")
            .reduce((acc, cur) => {
                const found = acc.find((item) => item.image === cur.image);
                if (found) {
                    found.counts++;
                } else {
                    acc.push({ ...cur, counts: 1 });
                }
                return acc;
            }, [] as { image: string; name: string; counts: number }[])
            .sort((a, b) => b.counts - a.counts);

        sceneCharcters.push({
            Cutscene_Key:
                tables.cutScenes.find(
                    (t) => t.FileName === scene[0].Dialog_Group
                )?.Key || "",
            Dialog_Group: scene[0].Dialog_Group,
            characters,
        });
    }
    return sceneCharcters;
};

export const getSceneCharacters = ({
    sceneCharacters,
    cutsceneIndex,
}: {
    sceneCharacters: SceneCharacters;
    cutsceneIndex: string;
}) => {
    if (
        cutsceneIndex === "0" ||
        (cutsceneIndex.length === 1 && cutsceneIndex[0] === "0")
    ) {
        return [];
    }

    const dialog = getDialogFromCutName(cutsceneIndex);
    const charcters = sceneCharacters.find(
        (s) => s.Cutscene_Key === dialog.Key
    );
    return charcters?.characters || [];
};

export const getDialogFromCutName = (cutName: string) => {
    const dialog = tables.cutScenes.find((c) => c.Key === cutName);
    if (!dialog) {
        throw new Error(`no dialog found for ${cutName}`);
    }
    return dialog;
};
