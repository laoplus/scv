import assert from "node:assert/strict";
import { test } from "node:test";

import type { Dialog } from "../pages/types/Scene";
import { advanceHistory, parseDialog, rewindHistory, selectHistory } from "./sceneHistory.ts";

const emptyDialog = {
    Key: "",
    Dialog_Group: "",
    BG_Name: "",
    BG_Description: "",
    BG_ImageName: "",
    Dialog_Speaker: 0,
    Char_ImageName_L: "",
    Char_Name_L: "",
    Char_AppearEffect_L: 0,
    Char_ImageVarName_L: "",
    Char_AnimationAdd_L: "",
    Char_SCGActivation_L: 0,
    Char_ImageName_R: "",
    Char_Name_R: "",
    Char_AppearEffect_R: 0,
    Char_ImageVarName_R: "",
    Char_AnimationAdd_R: "",
    Char_SCGActivation_R: 0,
    Char_ImageName_C: "",
    Char_Name_C: "",
    Char_AppearEffect_C: 0,
    Char_ImageVarName_C: "",
    Char_AnimationAdd_C: "",
    Char_SCGActivation_C: 0,
    Add_ImageName: "",
    Add_AppearEffect: 0,
    Add_OffEffect: 0,
    Script: "",
    SelectionIndex: [],
    SelectionIndex_Next: [],
    SelectionIndex_Cond: [],
    SelectionIndex_CondValue1: 0,
    SelectionIndex_CondValue2: 0,
    Char_OffEffect_L: 0,
    Char_OffEffect_R: 0,
    Char_OffEffect_C: 0,
    Screen_Effect: 0,
    Add_Effect: "",
    NextDialogScript: "",
    Dialog_Reward: "",
    Voice_CharName: "",
    Script_VoiceName: "",
    Bgm_Sound: "",
} satisfies Dialog;

function dialog(key: string, next = "", selections: string[] = []): Dialog {
    return {
        ...emptyDialog,
        Key: key,
        NextDialogScript: next,
        SelectionIndex: selections.map((_, index) => `選択肢${index + 1}`),
        SelectionIndex_Next: selections,
    };
}

void test("NEXTは1件ずつ進み、選択肢とENDでは進まない", () => {
    const first = dialog("first", "choice");
    const choice = dialog("choice", "end", ["end"]);
    const end = dialog("end");
    const scene = [first, choice, end];
    const initial = [parseDialog(first)];
    const advanced = advanceHistory(scene, initial);
    assert.deepEqual(
        advanced.map((item) => item.Key),
        ["choice", "first"],
    );
    assert.equal(initial.length, 1);
    assert.equal(advanceHistory(scene, advanced), advanced);
    const finished = [parseDialog(end)];
    assert.equal(advanceHistory(scene, finished), finished);
});

void test("指定した選択肢へ進み、元の履歴を変更せず選択結果を記録する", () => {
    const choice = dialog("choice", "", ["left", "right"]);
    const scene = [choice, dialog("left"), dialog("right")];
    const history = [parseDialog(choice)];
    const selected = selectHistory(scene, history, 1);
    assert.deepEqual(
        selected.map((item) => item.Key),
        ["right", "choice"],
    );
    assert.equal(selected[1]?.SelectionSelectedIndex, 1);
    assert.equal(history[0]?.SelectionSelectedIndex, null);
    assert.equal(history.length, 1);
});

void test("同じセリフが繰り返されても、選んだ履歴の位置へ戻れる", () => {
    const first = dialog("first", "choice");
    const choice = dialog("choice", "", ["first"]);
    const scene = [first, choice];
    const initial = [parseDialog(first)];
    const atChoice = advanceHistory(scene, initial);
    const looped = selectHistory(scene, atChoice, 0);
    const repeated = advanceHistory(scene, looped);
    assert.deepEqual(
        repeated.map((item) => item.Key),
        ["choice", "first", "choice", "first"],
    );
    const rewound = rewindHistory(repeated, 2);
    assert.deepEqual(
        rewound.map((item) => item.Key),
        ["choice", "first"],
    );
    assert.equal(repeated.length, 4);
    assert.equal(selectHistory(scene, rewound, 0)[0]?.Key, "first");
});

void test("履歴の選択先が欠けていても、巻き戻しには選択先の解決を要求しない", () => {
    const choice = parseDialog(dialog("choice", "next", ["missing"]));
    const history = [parseDialog(dialog("next")), choice];
    assert.deepEqual(rewindHistory(history, 1), [choice]);
});

void test("参照先が欠けた既存データの進行を維持する", (context) => {
    context.mock.method(console, "warn", () => undefined);
    const first = dialog("first", "missing");
    const next = dialog("next");
    assert.equal(advanceHistory([first, next], [parseDialog(first)])[0]?.Key, "next");
    const choice = dialog("choice", "next", ["missing"]);
    assert.equal(selectHistory([choice, next], [parseDialog(choice)], 0)[0]?.Key, "next");
});

void test("進行先も代替先もなければ失敗する", (context) => {
    context.mock.method(console, "warn", () => undefined);
    const first = dialog("first", "missing");
    assert.throws(() => advanceHistory([first], [parseDialog(first)]), /no next dialog/);
    const choice = dialog("choice", "", ["missing"]);
    assert.throws(
        () => selectHistory([choice], [parseDialog(choice)], 0),
        /selection next dialog not found/,
    );
});

void test("空の履歴や存在しない選択・履歴位置を受け付けない", () => {
    assert.throws(() => advanceHistory([], []), /no dialogs/);
    const first = dialog("first", "", ["first"]);
    const history = [parseDialog(first)];
    for (const index of [-1, 1, 0.5, NaN]) {
        assert.throws(() => selectHistory([first], history, index), /invalid selection index/);
    }
    for (const index of [-1, 0, 1, 0.5, NaN]) {
        assert.throws(() => rewindHistory(history, index), /invalid history index/);
    }
});
