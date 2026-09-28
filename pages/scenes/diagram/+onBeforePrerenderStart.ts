import { onBeforePrerenderStart as viewPagePrerender } from "../view/+onBeforePrerenderStart";
export function onBeforePrerenderStart() {
    const viewPathList = viewPagePrerender();
    return viewPathList.map((path) => path + "/diagram");
}
