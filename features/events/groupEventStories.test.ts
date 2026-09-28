import assert from "node:assert/strict";
import { test } from "node:test";

import { groupEventStories } from "./groupEventStories.ts";

test("カテゴリ順とカテゴリ内のイベント順を維持し、入力を変更しない", () => {
  const events = Object.freeze([
    { Event_Category: "Open_Event02", id: 1 },
    { Event_Category: "Open_Event01", id: 2 },
    { Event_Category: "Open_Event02", id: 3 },
  ].map((event) => Object.freeze(event)));
  assert.deepEqual(groupEventStories(events), [[events[0], events[2]], [events[1]]]);
});

test("数値キーと特殊なプロパティ名でも従来のグループ順を維持する", () => {
  const events = ["10", "2", "__proto__", "constructor", "__proto__"]
    .map((Event_Category, id) => ({ Event_Category, id }));
  assert.deepEqual(groupEventStories(events), [
    [events[1]], [events[0]], [events[2], events[4]], [events[3]],
  ]);
});

test("空のイベント一覧にはグループを作らない", () => {
  assert.deepEqual(groupEventStories([]), []);
});
