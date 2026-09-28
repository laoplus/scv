import { SceneViewer } from "../../../components/SceneViewer";
import { onBeforeRender } from "./+onBeforeRender";

export type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];

export function Page({ scene }: PageContext["pageProps"]) {
    if (scene.length === 0) {
        return <p>no dialogs...</p>;
    }

    return <SceneViewer scene={scene} />;
}
