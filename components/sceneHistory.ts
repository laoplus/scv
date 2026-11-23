import type { Dialog } from "../pages/types/Scene";

export type ExtendedDialog = Dialog & {
    speaker:
        | {
              name: string;
              speaking: boolean;
          }
        | undefined;
    hasNextDialog: boolean;
    SelectionSelectedIndex: number | null;
};

export const parseDialog = (dialog: Dialog) => {
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
    const hasNextDialog = dialog.NextDialogScript !== "";

    return {
        SelectionSelectedIndex: null,
        speaker,
        hasNextDialog,
        ...dialog,
    };
};

function currentDialog(history: ExtendedDialog[]) {
    const current = history[0];
    if (!current) throw new Error("no dialogs");
    return current;
}

export function advanceHistory(scene: Dialog[], history: ExtendedDialog[]) {
    const current = currentDialog(history);
    if (current.SelectionIndex.length > 0 || !current.hasNextDialog) return history;
    const nextDialog = scene.find((dialog) => dialog.Key === current.NextDialogScript);
    if (nextDialog) return [parseDialog(nextDialog), ...history];

    // 通常はNextDialogScriptを辿る。参照先が欠けた既存データも読めるよう、従来の配列順での進行を維持する。データ自体の修正はこの操作処理の変更に含めない。
    console.warn("'NextDialogScript' not found. fallback to next dialog...", current);
    const currentIndex = scene.findIndex((dialog) => dialog.Key === current.Key);
    const followingDialog = scene[currentIndex + 1];
    if (!followingDialog) throw new Error("no next dialog");
    return [parseDialog(followingDialog), ...history];
}

export function selectHistory(scene: Dialog[], history: ExtendedDialog[], index: number) {
    const current = currentDialog(history);
    if (!Number.isInteger(index) || index < 0 || index >= current.SelectionIndex.length) {
        throw new Error("invalid selection index");
    }
    const selectedDialog = scene.find(
        (dialog) => dialog.Key === current.SelectionIndex_Next[index],
    );
    if (!selectedDialog) {
        // 通常は選択先を辿る。選択先が欠けた既存データも読めるよう、従来のNextDialogScriptへの進行を維持する。データ自体の修正はこの操作処理の変更に含めない。
        const nextDialog = current.hasNextDialog
            ? scene.find((dialog) => dialog.Key === current.NextDialogScript)
            : undefined;
        if (!nextDialog) throw new Error("selection next dialog not found");
        return [parseDialog(nextDialog), ...history];
    }
    return [
        parseDialog(selectedDialog),
        { ...current, SelectionSelectedIndex: index },
        ...history.slice(1),
    ];
}

export function rewindHistory(history: ExtendedDialog[], index: number) {
    if (!Number.isInteger(index) || index < 1 || index >= history.length) {
        throw new Error("invalid history index");
    }
    return history.slice(index);
}
