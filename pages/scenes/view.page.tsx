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

  // 日本版追加要素の暫定対応
  // 既存のシナリオのKeyを変えてシナリオを追加してるので、ゲームで参照されないsceneは無視する
  const filteredScene = scene.filter((s) => s.Key.includes(s.Dialog_Group));

  return <SceneViewer scene={filteredScene} />;
}
