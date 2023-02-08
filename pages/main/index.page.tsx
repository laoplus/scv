import React from "react";

import { ChapterGrid } from "../../components/ChapterGrid";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./index.page.server";

type PageProps = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"]["pageProps"];

export const documentProps = {
  title: "メインストーリー",
};

export function Page({ chapters }: PageProps) {
  return (
    <div className="md:mx-4 lg:mx-8">
      <Heading level={1}>Main Stories</Heading>

      <ChapterGrid chapters={chapters} />
    </div>
  );
}
