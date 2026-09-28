import type { SearchIndex } from "./+Page";
import { toHiragana } from "./util.ts";

export function filterSearchIndex(
    searchIndex: SearchIndex[],
    searchString: string,
    searchSpeakerNames: (string | null)[],
    searchSceneNames: (string | null)[],
): SearchIndex[] {
    const needle = toHiragana(
        searchString
            .toLowerCase()
            // SKK対応（！？）
            .replace(/▽|▼/gm, "")
            .normalize("NFKC"),
    );
    let result = searchIndex.filter((d) => {
        const haystack = toHiragana(d.script.toLowerCase().normalize("NFKC"));
        return haystack.includes(needle);
    });

    // 話者での絞り込み
    if (searchSpeakerNames.length !== 0) {
        result = result.filter((d) =>
            searchSpeakerNames.includes(d.speaker.name),
        );
    }

    // シーンでの絞り込み
    if (searchSceneNames.length !== 0) {
        result = result.filter((d) => searchSceneNames.includes(d.sceneName));
    }

    return result;
}
