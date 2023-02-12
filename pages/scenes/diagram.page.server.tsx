import { PageContextBuiltIn } from "vite-plugin-ssr";

import { getDialogFromCutName, loadScene } from "../serverUtil";
import { prerender as viewPagePrerender } from "./view.page.server";
import { getStoryCutInfoFromParam, isSceneType } from "./viewUtil";

export async function onBeforeRender({ routeParams }: PageContextBuiltIn) {
  const { chapter, stageIdxStr, sceneType } = routeParams;

  if (!isSceneType(sceneType)) {
    throw new Error("invalid sceneType");
  }

  const cutInfo = getStoryCutInfoFromParam({
    chapter,
    stageIdxStr,
    sceneType,
  });
  const dialog = getDialogFromCutName(cutInfo.cutSceneIndex);
  const scene = await loadScene(dialog.FileName + ".json");

  const mermaidSourceArray = ["graph TB"];

  scene.forEach((dialog) => {
    const speaker = [
      {
        name: dialog.Char_Name_L,
        speaking: dialog.Dialog_Speaker === 0 ? true : false,
      },
      {
        name: dialog.Char_Name_R,
        speaking: dialog.Dialog_Speaker === 1 ? true : false,
      },
      {
        name: dialog.Char_Name_C,
        speaking: dialog.Dialog_Speaker === 2 ? true : false,
      },
    ].find((c) => c.speaking);

    const script = (() =>
      dialog.Script === ""
        ? "（テキスト無し）"
        : dialog.Script.replaceAll("\n", "<br/>"))().trim();

    const node = (() => {
      if (
        speaker === undefined ||
        speaker.name === "" ||
        speaker.name === "-" ||
        speaker.name === "主人公"
      ) {
        if (script.startsWith("- ")) {
          // 心情描写なので角丸
          return `${dialog.Key}("${script}")`;
        }

        return `${dialog.Key}["${script}"]`;
      }

      // 人物名付き
      return `${dialog.Key}["${speaker.name}:<br/>${script}"]`;
    })();

    mermaidSourceArray.push(`    ${node}`);
  });

  scene.forEach((dialog) => {
    // 選択肢がない場合
    if (dialog.NextDialogScript !== "" && dialog.SelectionIndex.length === 0) {
      mermaidSourceArray.push(
        `    ${dialog.Key} --> ${dialog.NextDialogScript}`
      );
    }

    // 選択肢がある場合
    if (dialog.SelectionIndex.length !== 0) {
      dialog.SelectionIndex.forEach((selection, index) => {
        const dest = dialog.SelectionIndex_Next[index];
        if (dest === undefined) {
          // 選択肢があるがSelectionIndex_Nextがない場合
          mermaidSourceArray.push(
            `    ${dialog.Key} -- "${selection}" --> ${dialog.NextDialogScript}`
          );
        } else {
          // 選択肢があってSelectionIndex_Nextもある場合
          mermaidSourceArray.push(
            `    ${dialog.Key} -- "${selection}" --> ${dialog.SelectionIndex_Next[index]}`
          );
        }
      });
    }
  });

  return {
    pageContext: {
      pageProps: {
        mermaidSource: mermaidSourceArray.join("\n"),
        ...cutInfo,
      },
      documentProps: {
        title: [
          cutInfo.eventName,
          cutInfo.stageIdx,
          cutInfo.stageName,
          cutInfo.cutType,
        ].join(" "),
        description: "「" + cutInfo.stageDescription + "」",
      },
    },
  };
}

export async function prerender() {
  const viewPathList = await viewPagePrerender();
  return viewPathList.map((path) => path + "/diagram");
}
