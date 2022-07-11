import fs from "fs/promises";
import { PageContextBuiltIn } from "vite-plugin-ssr";
import { Scenario } from "./types/Scenario";
import { getScenarioFilenames } from "./util";

// このページで表示する詳細を取得する
export async function onBeforeRender(pageContext: PageContextBuiltIn) {
  const file = await fs.readFile(
    `data/dialogs/${pageContext.routeParams.sId}.json`,
    "utf-8"
  );
  const scenario = JSON.parse(file) as Scenario;

  return {
    pageContext: {
      pageProps: {
        s: scenario,
      },
      documentProps: {
        // title: scenario[0].Dialog_Group || "NO TITLE",
      },
    },
  };
}

export async function prerender() {
  const files = (await getScenarioFilenames()).filter((a) =>
    a.includes("Ch01Stage")
  );

  return files.map((file) => `/scenarios/${file.replace(".json", "")}`);
}
