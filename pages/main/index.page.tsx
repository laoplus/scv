import React from "react";
import { UnitIcon } from "../../components/UnitIcon";
import { onBeforeRender } from "./index.page.server";
import { VscChevronRight } from "react-icons/vsc";
import { cn } from "../../components/utils";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ chapters }: PageProps) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <h1 className="py-12 px-4 text-4xl font-extrabold tracking-tight text-gray-900 md:px-0">
        Main Stories
      </h1>

      <div className="grid gap-px overflow-hidden bg-slate-200 shadow sm:rounded-lg md:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <a
            key={chapter.Key}
            id={`main${chapter.Key}`}
            className={cn(
              "group z-10 bg-white p-6 outline-none transition-colors ",
              "hover:bg-slate-50",
              "focus:bg-slate-50 focus:ring focus:ring-inset"
            )}
            href={`/main/${chapter.Chapter_IDX}`}
          >
            <div className="mb-7 flex items-center justify-between">
              <UnitIcon
                src={chapter.CharacterIcon}
                alt={chapter.ChapterName}
                className="h-12 w-12 rounded-md"
                borderClassName="rounded-md"
                withInsetBorder={true}
              />
              <VscChevronRight
                className={cn(
                  "h-8 w-8 -translate-x-12 opacity-0 transition-all",
                  "group-hover:translate-x-0 group-hover:opacity-50",
                  "group-focus:translate-x-0 group-focus:opacity-50"
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">
                第{chapter.Chapter_IDX}区域
              </p>
              <p className="font-bold">{chapter.ChapterName}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
