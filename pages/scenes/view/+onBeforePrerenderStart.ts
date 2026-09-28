import { publicEvents } from "../../events/publicEvents";
import { extractChapterIndexFromChapterKey, tables } from "../../serverUtil";
import type { ChapterSubStoryGroup } from "../../types/Table_ChapterSubStoryGroup";
import type { Stage } from "../../types/Table_MapStage";
export function onBeforePrerenderStart() {
    let stages: (Stage & { chapter: string })[] = [];
    let subStoryGroups: (ChapterSubStoryGroup & {
        eventIndex: number;
        chapterIndex: number;
    })[] = [];
    const pathList: string[] = [];

    publicEvents.forEach((event) => {
        const eventStages = tables.stages.filter((s) => s.ChapterIndex === event.Chapter_Key);
        stages = [
            ...stages,
            ...eventStages.map((stage) => ({
                chapter: `ev${event.Event_CategoryPos}`,
                ...stage,
            })),
        ];

        const eventSubStoryGroups = tables.chapterSubStoryGroups.filter(
            (s) => s.ChapterIndex === event.Chapter_Key,
        );
        subStoryGroups = [
            ...subStoryGroups,
            ...eventSubStoryGroups.map((subStoryGroup) => ({
                eventIndex: event.Event_CategoryIndex,
                chapterIndex: extractChapterIndexFromChapterKey(event.Chapter_Key),
                ...subStoryGroup,
            })),
        ];
    });

    const mainChapters = tables.chapters.filter((c) => c.GameModeType === 0).map((c) => c.Key);
    mainChapters.forEach((chapter) => {
        const mainStages = tables.stages.filter((s) => s.ChapterIndex === chapter);
        stages = [
            ...stages,
            ...mainStages.map((stage) => ({
                chapter: "main",
                ...stage,
            })),
        ];
    });

    stages.forEach((stage) => {
        if (stage.StartCutsceneIndex !== "0") {
            pathList.push(`/scenes/${stage.chapter}/${stage.StageIdxString}/op`.toLowerCase());
        }
        if (stage.EndCutsceneIndex !== "0") {
            pathList.push(`/scenes/${stage.chapter}/${stage.StageIdxString}/ed`.toLowerCase());
        }
        if (stage.MidCutsceneIndex[0] !== "0") {
            stage.MidCutsceneIndex.forEach((_mid, i) => {
                pathList.push(
                    `/scenes/${stage.chapter}/${stage.StageIdxString}/mid${i + 1}`.toLowerCase(),
                );
            });
        }
    });

    subStoryGroups.forEach((subStoryGroup) => {
        subStoryGroup.ChapterSubStoryIndex
            // 未実装のものをフィルタする
            .filter((idx) => tables.chapterSubStories.find((subStory) => subStory.Key === idx))
            .forEach((_, index) => {
                const unitName = subStoryGroup.Key.split("_").at(-1);
                if (unitName === undefined) throw new Error("Missing unit name");
                pathList.push(
                    [
                        `/scenes`,
                        `ev${subStoryGroup.eventIndex}`,
                        `sub`,
                        `${subStoryGroup.chapterIndex}`,
                        unitName,
                        `${index + 1}`,
                        ``,
                    ]
                        .join("/")
                        .toLowerCase(),
                );
            });
    });

    const ignorePaths = [
        // Cut_Ch01Ev13Stage02_3
        "/scenes/ev13/ev1-2/mid1",
    ];
    const newPathList = pathList.filter((path) => !ignorePaths.includes(path));
    // console.log(JSON.stringify(newPathList, null, 2));

    return newPathList;
}
