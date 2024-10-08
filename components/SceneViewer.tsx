import React, { useCallback, useEffect, useState } from "react";

import { PageContext } from "../pages/scenes/view/+Page";
import { Dialog } from "../pages/types/Scene";
import { cn, convertScriptTextToHtml } from "./utils";

export type ExtendedDialog = Dialog & {
  speaker?: {
    name: string;
    speaking: boolean;
  };
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

function findClosestBgImage(dialogs: ExtendedDialog[]) {
  const findClosestBgImage = dialogs
    .map((d) => d.BG_ImageName)
    .filter((b) => b)
    .at(0);
  return findClosestBgImage;
}

export function SceneViewer({ scene }: PageContext["pageProps"]) {
  const [history, setHistory] = useState<ExtendedDialog[]>([
    parseDialog(scene[0]),
  ]);
  const addHistory = (dialog: Dialog) => {
    setHistory([parseDialog(dialog), ...history]);
  };
  const latestDialog = (): ExtendedDialog => {
    if (history.length === 0) {
      throw new Error("no dialogs");
    }
    return history[0];
  };

  const dialogNextHandler = (dialog: ExtendedDialog) => {
    const isCurrentDialog = dialog.Key === latestDialog().Key;

    if (isCurrentDialog) {
      if (!dialog.hasNextDialog) {
        return;
      }
      const nextDialog = scene.find((d) => d.Key === dialog.NextDialogScript);
      if (nextDialog) {
        addHistory(nextDialog);
        return;
      }

      // nextDialogが見つからなかったときのfallback
      // 次の番号のdialogを取得する
      console.warn(
        "'NextDialogScript' not found. fallback to next dialog...",
        dialog,
      );
      const currentDialogIndex = scene.findIndex((d) => d.Key === dialog.Key);
      const anotherNextDialog = scene[currentDialogIndex + 1];
      if (!anotherNextDialog) {
        throw new Error("no next dialog");
      }
      addHistory(anotherNextDialog);
    } else {
      // is history
      const historyIndex = history.findIndex(
        (historyDialog) => historyDialog.Key === dialog.Key,
      );
      setHistory(history.slice(historyIndex));
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const selectionHandler = (dialog: ExtendedDialog, index: number) => {
    const isCurrentDialog = dialog.Key === latestDialog().Key;
    const selectionDialogKey = dialog.SelectionIndex_Next[index];
    const selectionDialog = scene.find((d) => d.Key === selectionDialogKey);
    if (!selectionDialog) {
      // 選択肢があるが選択先がないことが稀にある
      if (dialog.hasNextDialog) {
        const nextDialog = scene.find((d) => d.Key === dialog.NextDialogScript);
        if (!nextDialog) {
          throw new Error("next dialog not found");
        }
        addHistory(nextDialog);
        return;
      }
      throw new Error("selection next dialog not found");
    }

    if (isCurrentDialog) {
      setHistory([
        parseDialog(selectionDialog),
        { ...latestDialog(), SelectionSelectedIndex: index },
        // history but not contain latest dialog
        ...history.slice(1),
      ]);
    } else {
      // is history
      const historyIndex = history.findIndex(
        (historyDialog) => historyDialog.Key === dialog.Key,
      );
      setHistory(history.slice(historyIndex));
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
  const bgImages = new Set(
    [...new Set(scene.map((d) => d.BG_ImageName))].filter((e) => e),
  );
  const cutImages = new Set(
    [...new Set(scene.map((d) => d.Add_ImageName))]
      .filter((e) => e)
      // ゼロ幅スペースを削除
      .map((d) => d.replace(/\u200B/g, "")),
  );

  const keyboardHandler = useCallback((event: { key: string }) => {
    if (event.key === "Enter") {
      document
        .querySelector<HTMLButtonElement>(".js-current-dialog button")
        ?.click();
    }
    if (event.key === "Backspace") {
      document
        .querySelector<HTMLButtonElement>(
          ".js-dialog:not(.js-current-dialog) button",
        )
        ?.click();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyboardHandler, false);

    return () => {
      document.removeEventListener("keydown", keyboardHandler, false);
    };
  }, [keyboardHandler]);

  const screenClickHandler = useCallback(() => {
    document
      .querySelector<HTMLButtonElement>(".js-current-dialog button")
      ?.click();
  }, []);

  // bg imageは最後のものを表示する
  const closetBgImage = findClosestBgImage(history);
  // cut imageはその時指定されているものだけ表示する
  const currentCutImage = latestDialog()
    .Add_ImageName // ゼロ幅スペースを削除
    .replace(/\u200B/g, "");

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-24">
      <div className="flex flex-col">
        <div
          className="relative z-10 aspect-video max-h-80 w-full select-none overflow-hidden rounded-b bg-slate-500"
          onClick={screenClickHandler}
        >
          {[...bgImages].map((image, index) => (
            <img
              key={index}
              src={CDN_BASE_URL + "/bg/" + image + `.webp`}
              className={cn(
                "pointer-events-none absolute inset-0 mx-auto h-full object-contain opacity-0 transition-opacity delay-200 duration-300",
                {
                  "pointer-events-auto opacity-100 delay-[0ms]":
                    closetBgImage === image,
                },
              )}
            />
          ))}
          {[...cutImages].map((image, index) => (
            <img
              key={index}
              src={CDN_BASE_URL + "/cut/" + image + `.webp`}
              className={cn(
                "pointer-events-none absolute left-0 right-0 mx-auto max-h-full object-contain p-2 pb-3 opacity-0 transition-opacity delay-200 duration-300",
                {
                  "pointer-events-auto opacity-100 delay-[0ms]":
                    currentCutImage === image,
                },
              )}
            />
          ))}

          <div
            className={cn(
              "pointer-events-none absolute flex h-full w-full flex-col gap-4 bg-white bg-opacity-50 p-6 text-center backdrop-blur-sm",
              {
                "opacity-0": history.length !== 1,
              },
            )}
            data-nosnippet
          >
            <h2 className="text-xl font-bold">シーンビューアの使い方</h2>
            <ol className="flex flex-col gap-2">
              <li>
                背景画像・セリフ下のNEXT・選択肢をクリックで
                <strong>セリフ送り</strong>
              </li>
              <li>
                過去のセリフの選択肢・BACKをクリックで
                <strong>ログジャンプ</strong>
              </li>
            </ol>
          </div>
        </div>

        <div className="relative -top-2 z-10 flex flex-col gap-2 px-2">
          {history.map((sd) => {
            const hasNextDialog = sd.NextDialogScript !== "";
            return (
              <div
                key={sd.Key}
                className={cn(
                  "js-dialog relative flex min-h-[4rem] animate-dialog-appear flex-col justify-center rounded border bg-white bg-opacity-90 p-4 opacity-75 transition-opacity hover:opacity-100",
                  {
                    "js-current-dialog opacity-100":
                      latestDialog().Key === sd.Key,
                  },
                )}
              >
                <div className="flex flex-col gap-1">
                  {sd.speaker?.name && (
                    <span className="font-bold">{sd.speaker.name}</span>
                  )}
                  <div
                    className="break-all leading-normal"
                    style={{
                      minHeight: "calc(1em * 2 * 1.5)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: convertScriptTextToHtml(sd.Script),
                    }}
                  />

                  {/* NEXT / BACK */}
                  {sd.SelectionIndex.length === 0 && hasNextDialog && (
                    <button
                      className={cn(
                        "select-none border-b border-orange-400 border-opacity-0 text-right text-sm hover:border-opacity-100",
                      )}
                      onClick={() => {
                        dialogNextHandler(sd);
                      }}
                    >
                      {latestDialog().Key === sd.Key ? "NEXT" : "BACK"}
                    </button>
                  )}

                  {
                    // no next dialog and no selection
                    sd.SelectionIndex.length === 0 && !hasNextDialog && (
                      <div className="select-none text-right text-sm">END</div>
                    )
                  }

                  {sd.SelectionIndex.map((si, i) => {
                    return (
                      <button
                        key={i}
                        className={cn(
                          "cursor-pointer rounded-md border p-2 text-left font-bold text-orange-400",
                          {
                            "bg-orange-600 text-white":
                              sd.SelectionSelectedIndex === i,
                          },
                        )}
                        onClick={() => {
                          selectionHandler(sd, i);
                        }}
                      >
                        {si}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2  px-2">
        <h2 className="text-2xl">Transcription</h2>
        <ol className="list-outside list-decimal rounded border p-4 pl-10 text-sm text-gray-600">
          {scene.map((d, i) => {
            const dialog = parseDialog(d);
            const speaker = dialog.speaker?.name && (
              <>
                <span className="">{dialog.speaker?.name}</span>
                <span className="opacity-70">: </span>
              </>
            );
            const selection = dialog.SelectionIndex.length > 0 && (
              <ol className="ml-4 list-inside list-decimal">
                {dialog.SelectionIndex.map((si, i) => (
                  <li key={i}>
                    <span className="">{si}</span>
                  </li>
                ))}
              </ol>
            );

            return (
              <li key={i} className="">
                {speaker}
                <p
                  className="inline"
                  dangerouslySetInnerHTML={{
                    __html: convertScriptTextToHtml(dialog.Script),
                  }}
                ></p>
                {selection}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
