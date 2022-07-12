import fs from "fs";
import type { TableMapChapter } from "./types/Table_MapChapter";
import type { TableMapStage } from "./types/Table_MapStage";
import type { TableEventChapter } from "./types/Table_EventChapter";
import type { TableCutscene } from "./types/Table_Cutscene";

export async function getScenarioFilenames() {
    const files = await fs.promises.readdir("data/dialogs");
    return files.filter((file) => file.endsWith(".json"));
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
