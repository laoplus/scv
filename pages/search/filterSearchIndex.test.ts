import assert from "node:assert/strict";
import { mock, test } from "node:test";

import type { SearchIndex } from "./+Page";
import { filterSearchIndex } from "./filterSearchIndex.ts";

const entries: SearchIndex[] = [
    {
        key: "1",
        script: "ＡＢＣ ガール",
        speaker: { name: "アリス", icon: null },
        sceneName: "A",
        path: "/1",
    },
    {
        key: "2",
        script: "abc ｶﾞｰﾙ",
        speaker: { name: null, icon: null },
        sceneName: "B",
        path: "/2",
    },
    {
        key: "3",
        script: "別の文章",
        speaker: { name: "アリス", icon: null },
        sceneName: "B",
        path: "/3",
    },
    {
        key: "4",
        script: "▽▼",
        speaker: { name: null, icon: null },
        sceneName: "A",
        path: "/4",
    },
];

test("検索語の文字種とSKK用記号を従来どおり扱う", () => {
    for (const query of [
        "abc",
        "ABC",
        "ＡＢＣ",
        "がーる",
        "ガール",
        "ｶﾞｰﾙ",
        "▽ＡＢＣ▼",
        "A▽B▼C",
    ]) {
        assert.deepEqual(
            filterSearchIndex(entries, query, [], []),
            entries.slice(0, 2),
            query,
        );
    }
    assert.deepEqual(filterSearchIndex(entries, "見つからない", [], []), []);
    assert.deepEqual(filterSearchIndex([], "abc", [], []), []);
});

test("空の検索語・話者・シーンの組み合わせで順序と件数を維持する", () => {
    for (const query of ["", "▽▼"]) {
        assert.deepEqual(filterSearchIndex(entries, query, [], []), entries);
    }
    assert.deepEqual(filterSearchIndex(entries, "", ["アリス"], []), [
        entries[0],
        entries[2],
    ]);
    assert.deepEqual(filterSearchIndex(entries, "", [null], []), [
        entries[1],
        entries[3],
    ]);
    assert.deepEqual(filterSearchIndex(entries, "", [], ["B"]), [
        entries[1],
        entries[2],
    ]);
    assert.deepEqual(filterSearchIndex(entries, "abc", [null], ["B"]), [
        entries[1],
    ]);
    assert.deepEqual(filterSearchIndex(entries, "abc", ["アリス"], ["B"]), []);
    assert.deepEqual(
        filterSearchIndex(entries, "", [null, "アリス"], ["B", "A"]),
        entries,
    );
    assert.deepEqual(filterSearchIndex(entries, "", [], [null]), []);
});

test("検索語の正規化はレコード数によらず1回だけ行う", () => {
    const normalize = mock.method(String.prototype, "normalize");
    try {
        filterSearchIndex(entries, "query", [], []);
        const queryCalls = normalize.mock.calls.filter(
            (call) => String(call.this) === "query",
        );
        assert.equal(queryCalls.length, 1);
    } finally {
        normalize.mock.restore();
    }
});
