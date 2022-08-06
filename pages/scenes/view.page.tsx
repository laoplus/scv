import React, { useCallback, useEffect, useState } from "react";
import { cn, convertScriptTextToHtml } from "../../components/utils";
import { Dialog, Scene } from "../types/Scene";

type ExtendedDialog = Dialog & {
  speaker?: {
    name: string;
    speaking: boolean;
  };
  hasNextDialog: boolean;
  SelectionSelectedIndex: number | null;
};

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
  const hasNextDialog = dialog.NextDialogScript !== "";

  return {
    SelectionSelectedIndex: null,
    speaker,
    hasNextDialog,
    ...dialog,
  };
};

export function Page({ scene }: { scene: Scene }) {
  if (scene.length === 0) {
    return <p>no dialogs...</p>;
  }

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
      if (!nextDialog) {
        throw new Error("next dialog not found");
      }
      addHistory(nextDialog);
    } else {
      // is history
      const historyIndex = history.findIndex(
        (historyDialog) => historyDialog.Key === dialog.Key
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
        (historyDialog) => historyDialog.Key === dialog.Key
      );
      setHistory(history.slice(historyIndex));
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
  const bgImages = new Set(
    scene.map((d) => CDN_BASE_URL + "bg/" + d.BG_ImageName + `.webp`)
  );
  const addImages = new Set(
    scene
      .filter((d) => d.Add_ImageName !== "")
      .map((d) => CDN_BASE_URL + "cut/" + d.Add_ImageName + `.webp`)
  );

  useEffect(() => {
    document.addEventListener("keydown", keyboardHandler, false);

    return () => {
      document.removeEventListener("keydown", keyboardHandler, false);
    };
  }, []);

  const keyboardHandler = useCallback((event: { key: string }) => {
    if (event.key === "Enter") {
      document
        .querySelector<HTMLButtonElement>(".js-current-dialog button")
        ?.click();
    }
    if (event.key === "Backspace") {
      document
        .querySelector<HTMLButtonElement>(
          ".js-dialog:not(.js-current-dialog) button"
        )
        ?.click();
    }
  }, []);

  const screenClickHandler = useCallback(() => {
    document
      .querySelector<HTMLButtonElement>(".js-current-dialog button")
      ?.click();
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
      <div
        className="relative z-10 aspect-video max-h-80 w-full select-none overflow-hidden rounded-b bg-slate-500"
        onClick={screenClickHandler}
      >
        {[...bgImages].map((image, index) => (
          <img
            key={index}
            src={image}
            className={cn(
              "pointer-events-none absolute inset-0 mx-auto h-full object-contain opacity-0 transition-opacity delay-200 duration-300",
              {
                "pointer-events-auto opacity-100 delay-[0ms]": image.includes(
                  latestDialog().BG_ImageName
                ),
              }
            )}
          />
        ))}
        {[...addImages].map((image, index) => (
          <img
            key={index}
            src={image}
            className={cn(
              "pointer-events-none absolute inset-6 opacity-0 transition-opacity delay-200 duration-300",
              {
                "pointer-events-auto opacity-100 delay-[0ms]":
                  latestDialog().Add_ImageName !== "" &&
                  image.includes(latestDialog().Add_ImageName),
              }
            )}
          />
        ))}
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
                }
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
                      "select-none border-b border-orange-400 border-opacity-0 text-right text-sm hover:border-opacity-100"
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
                        }
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
      <div className="h-screen" />
      <div className="p-2">
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
