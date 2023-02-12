import React from "react";

import { SceneViewer } from "../../components/SceneViewer";
import { onBeforeRender } from "./view.page.server";

export type PageContext = Awaited<
  ReturnType<typeof onBeforeRender>
>["pageContext"];

export function getDocumentProps({
  documentProps: { title, description },
}: PageContext) {
  return { title, description };
}

export function Page({ scene }: PageContext["pageProps"]) {
  if (scene.length === 0) {
    return <p>no dialogs...</p>;
  }

  return <SceneViewer scene={scene} />;
}
