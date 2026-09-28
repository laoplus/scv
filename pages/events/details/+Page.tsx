import { StageGridTable, SubStoryGridTable } from "../../../components/GridTable";
import { Heading } from "../../../components/Heading";
import { onBeforeRender } from "./+onBeforeRender";

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];

export function Page({ eventStories, subStoryGroups }: PageContext["pageProps"]) {
    const firstChapter = eventStories[0]?.[0];
    if (!firstChapter) throw new Error("Event chapter not found");
    return (
        <div className="md:mx-4 lg:mx-8">
            <Heading level={1}>
                <span>{firstChapter.Event_CategoryName}</span>
            </Heading>
            <div
                key={firstChapter.Event_Category}
                id={`ev${firstChapter.Event_CategoryIndex}`}
                className="flex flex-col gap-8"
            >
                {eventStories.map((event) =>
                    event.map((chapter) =>
                        chapter.ChapterStages.every((s) => !s.hasCutscene) ? undefined : ( // 全てのステージがシーンなしの場合
                            <div
                                key={chapter.Chapter_Key}
                                className="flex flex-col gap-6 px-4 md:px-0"
                            >
                                {event.length !== 1 && (
                                    <h2 className="text-2xl">{chapter.Chapter_Name}</h2>
                                )}

                                <StageGridTable
                                    eventIndexStr={`ev${chapter.Event_CategoryIndex}`}
                                    stages={chapter.ChapterStages}
                                />
                            </div>
                        ),
                    ),
                )}

                {subStoryGroups.length !== 0 && (
                    <div className="flex flex-col gap-8">
                        <h2 className="text-2xl">サブストーリー</h2>

                        <div className="flex flex-col gap-6 px-4 md:px-0">
                            {subStoryGroups.map((subStoryGroup) => (
                                <div key={subStoryGroup.Key} className="flex flex-col gap-2">
                                    <h3 className="text-xl">{subStoryGroup.PCName}</h3>
                                    <SubStoryGridTable subStoryGroup={subStoryGroup} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
