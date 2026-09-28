import type { PageContextServer } from "vike/types";

import { getDialogFromCutName, loadScene } from "../../serverUtil";
import { getStoryCutInfoFromParam, getSubStoryInfoFromParam, isSceneType } from "./viewUtil";

// このページで表示する詳細を取得する
export async function onBeforeRender({ routeParams }: PageContextServer) {
    const catchAll = routeParams["*"];
    if (catchAll === undefined) throw new Error("Missing scene route");

    if (catchAll.includes("/sub/")) {
        const regex =
            /ev(?<eventIndex>\d+)\/sub\/(?<chapterIndex>\d+)\/(?<unitName>.+)\/(?<index>\d+)/;
        const match = regex.exec(catchAll);
        if (!match?.groups) {
            console.error("invalid route", catchAll);
            throw new Error("invalid route");
        }
        const { eventIndex, chapterIndex, unitName, index } = match.groups;
        if (unitName === undefined) throw new Error("Missing unit name");

        const { subStory, eventName } = getSubStoryInfoFromParam({
            eventIndex: Number(eventIndex),
            chapterIndex: Number(chapterIndex),
            unitName,
            index: Number(index),
        });
        const dialog = getDialogFromCutName(subStory.StoryDialog);
        const scene = await loadScene(dialog.FileName + ".json");

        return {
            pageContext: {
                pageProps: {
                    scene,
                },
                documentProps: {
                    title: [eventName, "Sub", subStory.StoryName].join(" "),
                    // サブストーリーには説明がない
                    description: "",
                },
            },
        };
    }

    const regex = /(?<chapter>ev\d+|main)\/(?<stageIdxStr>.+)\/(?<sceneType>op|ed|mid\d+)/;
    const match = regex.exec(catchAll);
    if (!match?.groups) {
        console.error("invalid route", catchAll);
        throw new Error("invalid route");
    }
    const { chapter, stageIdxStr, sceneType } = match.groups;

    if (
        chapter === undefined ||
        stageIdxStr === undefined ||
        sceneType === undefined ||
        !isSceneType(sceneType)
    ) {
        throw new Error("invalid sceneType");
    }

    const cutInfo = getStoryCutInfoFromParam({
        chapter,
        stageIdxStr,
        sceneType,
    });
    const dialog = getDialogFromCutName(cutInfo.cutSceneIndex);
    const scene = await loadScene(dialog.FileName + ".json");

    return {
        pageContext: {
            pageProps: {
                scene,
            },
            documentProps: {
                title: [
                    cutInfo.eventName,
                    cutInfo.stageIdx,
                    cutInfo.stageName,
                    cutInfo.cutType,
                ].join(" "),
                description: "「" + cutInfo.stageDescription + "」",
            },
        },
    };
}
