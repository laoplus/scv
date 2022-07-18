import React from "react";
import { UnitIcon } from "../../components/UnitIcon";
import { onBeforeRender } from "./index.page.server";

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
            className="z-10 bg-white p-6"
            href={`/main/${chapter.Chapter_IDX}`}
          >
            <UnitIcon
              src={chapter.CharacterIcon}
              alt={chapter.ChapterName}
              className="mb-7 h-12 w-12 rounded-md"
              borderClassName="rounded-md"
              withInsetBorder={true}
            />
            <p className="mb-1 text-sm font-semibold text-gray-500">
              第{chapter.Chapter_IDX}区域
            </p>
            <p className="mb-2 font-bold">{chapter.ChapterName}</p>
            {/* <p className="text-sm text-slate-500">{chapter.Event_CategoryDesc}</p> */}
          </a>
        ))}
      </div>
    </div>
  );
}
