import fs from "fs/promises";

export async function getScenarioFilenames() {
    const files = await fs.readdir("data/dialogs");
    return files.filter((file) => file.endsWith(".json"));
}
