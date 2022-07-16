import fs from "fs";
import type { TableMapChapter } from "./types/Table_MapChapter";
import type { TableMapStage } from "./types/Table_MapStage";
import type { TableEventChapter } from "./types/Table_EventChapter";
import type { TableCutscene } from "./types/Table_Cutscene";
import { Scene } from "./types/Scene";

export async function getAllScenesFilenames() {
    const files = await fs.promises.readdir("data/dialogs");
    return files.filter((file) => file.endsWith(".json"));
}

export async function loadScene(filename: string) {
    const data = await fs.promises.readFile(`data/dialogs/${filename}`, "utf8");
    return JSON.parse(data) as Scene;
}

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

export async function createSceneCharacters() {
    const sceneFiles = await getAllScenesFilenames();

    const sceneCharcters = [] as unknown as SceneCharacters;

    for (const sceneFilename of sceneFiles) {
        const scene = await loadScene(sceneFilename);
        if (!scene[0]) {
            continue;
        }

        const characters = scene
            .flatMap((d) => {
                return [
                    { name: d.Char_Name_L, image: d.Char_ImageName_L },
                    { name: d.Char_Name_R, image: d.Char_ImageName_R },
                    { name: d.Char_Name_C, image: d.Char_ImageName_C },
                ];
            })
            .filter((c) => c.image !== "")
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
}
