import React from "react";
import { onBeforeRender } from "./index.page.server";
import { ChapterGrid } from "../../components/ChapterGrid";
import { Heading } from "../../components/Heading";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export const documentProps = {
  title: "イベントストーリー",
  description: "過去に開催されたイベントの一覧です。",
};

export function Page({ events }: PageProps) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <Heading level={1}>Event Stories</Heading>

      <ChapterGrid chapters={events} />
    </div>
  );
}
