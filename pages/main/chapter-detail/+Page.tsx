import { StageGridTable } from "../../../components/GridTable";
import { Heading } from "../../../components/Heading";
import { onBeforeRender } from "./+onBeforeRender";

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];

export function Page({ chapters }: PageContext["pageProps"]) {
    const firstChapter = chapters[0];
    if (!firstChapter) throw new Error("Chapter not found");

    return (
        <div className="md:mx-4 lg:mx-8">
            <Heading level={1}>{firstChapter.ChapterName}</Heading>

            <div className="flex flex-col gap-2">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.Key}
                        id={chapter.Key}
                        className="flex flex-col gap-6 px-4 md:px-0"
                    >
                        <StageGridTable eventIndexStr="main" stages={chapter.ChapterStages} />
                    </div>
                ))}
            </div>
        </div>
    );
}
