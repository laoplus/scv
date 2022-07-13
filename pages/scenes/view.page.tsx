import React, { useState } from "react";
import { cn } from "../../components/utils";
import { Scene, Dialog } from "../types/Scene";

type Speaker = {
  name: string;
  speaking: boolean;
};
type ExtendedDialog = Dialog & Partial<{ speaker: Speaker }>;

const parseDialog = (dialog: Dialog) => {
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

  return { ...dialog, speaker };
};

export function Page({ scene }: { scene: Scene }) {
  if (scene.length === 0) {
    return <p>no dialogs...</p>;
  }

  const [history, setHistory] = useState<ExtendedDialog[]>([
    parseDialog(scene[0]),
  ]);
  const addHistory = (dialog: Dialog) => {
    setHistory([...history, parseDialog(dialog)]);
  };
  const latestDialog = (): ExtendedDialog => {
    if (history.length === 0) {
      throw new Error("no dialogs");
    }
    return history.at(-1)!;
  };

  const dialogClickHandler = (dialog: ExtendedDialog) => {
    const isCurrentDialog = dialog.Key === latestDialog().Key;
    const hasNextDialog = dialog.NextDialogScript !== "";

    if (isCurrentDialog) {
      if (!hasNextDialog) {
        return;
      }
      const nextDialog = scene.find((d) => d.Key === dialog.NextDialogScript);
      if (!nextDialog) {
        throw new Error("next dialog not found");
      }
      addHistory(nextDialog);
    } else {
      // is history
      const historyIndex = history.findIndex(
        (historyDialog) => historyDialog.Key === dialog.Key
      );
      setHistory(history.slice(0, historyIndex + 1));
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const selectionHandler = (dialog: ExtendedDialog, index: number) => {
    const nextDialogKey = dialog.SelectionIndex_Next[index];
    const nextDialog = scene.find((d) => d.Key === nextDialogKey);
    if (!nextDialog) {
      throw new Error("next dialog not found");
    }
    addHistory(nextDialog);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="sticky">
        <header className="flex justify-between bg-slate-800 p-2 text-slate-100">
          <div>
            <span className="font-bold text-amber-500">SCV</span>
            <span className="opacity-50"> - </span>
            <span className="opacity-50">Last Origin Scenario Viewer</span>
          </div>
          <div className="opacity-50">{scene[0].Dialog_Group}</div>
        </header>
      </div>

      <div
        className="relative z-10 mb-2 aspect-video max-h-80 w-full overflow-hidden rounded-b bg-slate-500 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/img/bg/${latestDialog().BG_ImageName}.png)`,
          backgroundSize: "700px 105%",
        }}
      >
        {/* <img
          src="/img/unit/BR_Sirene_0_O_S.png"
          className="absolute -bottom-8 left-0 right-0 m-auto h-full"
        /> */}
      </div>

      <div className="relative top-0 flex w-[40rem] flex-col-reverse gap-2 ">
        {history.map((sd, i) => {
          const hasNextDialog = sd.NextDialogScript !== "";
          return (
            <div
              key={sd.Key}
              className={cn(
                "animate-dialog-appear flex-col rounded border p-4 opacity-50 transition-opacity",
                {
                  "opacity-100": latestDialog().Key === sd.Key,
                },
                {
                  "cursor-pointer": hasNextDialog,
                }
              )}
              onClick={() => {
                dialogClickHandler(sd);
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold">{sd.speaker?.name || ""}</span>
                <div
                  // [c][ffffff]のようなカラーコードの変換
                  dangerouslySetInnerHTML={{
                    __html: sd.Script.replace(
                      /\[c\]\[(......)\]/g,
                      `<span style="color:#$1;font-weight:bold;">`
                    ).replace(/\[\-\]\[\/c\]/g, `</span>`),
                  }}
                />

                {sd.SelectionIndex.map((si, i) => {
                  return (
                    <div
                      key={i}
                      className="cursor-pointer rounded-md border p-2 font-bold text-orange-400"
                      onClick={() => {
                        selectionHandler(sd, i);
                      }}
                    >
                      {si}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
