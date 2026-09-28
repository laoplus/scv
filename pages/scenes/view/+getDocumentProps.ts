import { onBeforeRender } from "./+onBeforeRender";
export function getDocumentProps({ documentProps: { title, description } }: PageContext) {
    return { title, description };
}

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];
