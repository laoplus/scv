import { tables } from "../../serverUtil";
import { Stage } from "../../types/Table_MapStage";

type SceneType = "op" | "ed" | `mid${number}`;

export function isSceneType(type: string): type is SceneType {
    return type === "op" || type === "ed" || type.startsWith("mid");
}

export function getSubStoryInfoFromParam({
    eventIndex,
    chapterIndex,
    unitName,
    index,
}: {
    eventIndex: number;
    chapterIndex: number;
    unitName: string;
    index: number;
}) {
    const subStoryGroup = tables.chapterSubStoryGroups.find(
        (s) =>
            s.Key.toLowerCase().includes(`${chapterIndex}ev${eventIndex}_`) &&
            s.Key.toLowerCase().endsWith(`_${unitName}`),
    );
    if (!subStoryGroup) {
        throw new Error(
            `no subStoryGroup found for ${chapterIndex} ${unitName}`,
        );
    }

    const subStoryKey = subStoryGroup?.ChapterSubStoryIndex[index - 1];
    if (!subStoryKey) {
        throw new Error(
            `no subStoryKey found for ${chapterIndex} ${unitName} ${index}`,
        );
    }

    const subStory = tables.chapterSubStories.find(
        (s) => s.Key === subStoryKey,
    );
    if (!subStory) {
        throw new Error(
            `no subStory found for ${chapterIndex} ${unitName} ${index}`,
        );
    }

    const eventChapters = tables.events.filter(
        (e) => e.Event_CategoryPos === eventIndex,
    );

    return {
        subStoryGroup,
        subStoryKey,
        subStory,
        eventName: eventChapters[0].Event_CategoryName,
    };
}

export function getStoryCutInfoFromParam({
    chapter,
    stageIdxStr,
    sceneType,
}: {
    chapter: string;
    stageIdxStr: string;
    sceneType: SceneType;
}) {
    let stage: Stage;

    const cutMeta = {
        stageName: "",
        stageDescription: "",
        stageIdx: "",
        /**
         * メインの場合は「メインストーリー」
         */
        eventName: "",
        /**
         * @value "OP" | "ED" | `Mid${number}`
         */
        cutType: sceneType.toUpperCase().replace("MID", "Mid "),
        /**
         * @example main
         * @example ev13
         */
        chapter: "",
    };

    if (chapter === "main") {
        cutMeta.eventName = "メインストーリー";
        const s = tables.stages.find(
            (s) => s.StageIdxString.toLowerCase() === stageIdxStr,
        );
        if (!s) {
            throw new Error(`no stage found for ${stageIdxStr}`);
        }
        stage = s;
    } else {
        const eventNumber = Number(chapter.replace("ev", ""));
        const eventChapters = tables.events.filter(
            (e) => e.Event_CategoryPos === eventNumber,
        );
        cutMeta.eventName = eventChapters[0].Event_CategoryName;
        const eventChaptersString = eventChapters.map((e) => e.Chapter_Key);
        let found;

        eventChaptersString.forEach((chapterKey) => {
            const result = tables.stages.find(
                (s) =>
                    s.ChapterIndex === chapterKey &&
                    s.StageIdxString.toLowerCase() === stageIdxStr,
            );
            if (result) {
                found = result;
            }
        });

        if (!found) {
            throw new Error(`no stage found for ${stageIdxStr}`);
        }
        stage = found;
    }

    cutMeta.stageName = stage.StageName;
    cutMeta.stageDescription = stage.StageDesc;
    cutMeta.stageIdx = stage.StageIdxString;
    cutMeta.chapter = chapter;

    switch (sceneType) {
        case "op":
            return {
                ...cutMeta,
                cutSceneIndex: stage.StartCutsceneIndex,
            };
        case "ed":
            return {
                ...cutMeta,
                cutSceneIndex: stage.EndCutsceneIndex,
            };
        default: {
            const index = Number(sceneType.slice(3));
            return {
                ...cutMeta,
                cutSceneIndex: stage.MidCutsceneIndex[index - 1],
            };
        }
    }
}
