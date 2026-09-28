import assert from "node:assert/strict";
import { test } from "node:test";

import { countNames } from "./countNames.ts";

void test("名前を出現順に集計する", () => {
    assert.deepEqual(Array.from(countNames(["アリス", "10", "2", "アリス", "", "ボブ"])), [
        ["アリス", 2],
        ["10", 1],
        ["2", 1],
        ["", 1],
        ["ボブ", 1],
    ]);
});

void test("nullと文字列nullを別の項目として数える", () => {
    assert.deepEqual(Array.from(countNames([null, "null", null])), [
        [null, 2],
        ["null", 1],
    ]);
});

void test("オブジェクトのプロパティ名も通常の名前として数える", () => {
    assert.deepEqual(
        Array.from(countNames(["__proto__", "constructor", "toString", "__proto__"])),
        [
            ["__proto__", 2],
            ["constructor", 1],
            ["toString", 1],
        ],
    );
});

void test("空の名前一覧には集計項目を作らない", () => {
    assert.deepEqual(Array.from(countNames([])), []);
});
