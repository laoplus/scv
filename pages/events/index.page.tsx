import React from "react";
import { onBeforeRender } from "./index.page.server";
import { ChapterGrid } from "../../components/ChapterGrid";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export function Page({ events }: PageProps) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <h1 className="py-12 px-4 text-4xl font-extrabold tracking-tight text-gray-900 md:px-0">
        Event Stories
      </h1>

      <ChapterGrid chapters={events} />
    </div>
  );
}
