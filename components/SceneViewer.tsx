import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";

import type { PageContext } from "../pages/scenes/view/+Page";
import { advanceHistory, parseDialog, rewindHistory, selectHistory } from "./sceneHistory";
import type { ExtendedDialog } from "./sceneHistory";
import { cn, convertScriptTextToHtml } from "./utils";

export { parseDialog } from "./sceneHistory";
export type { ExtendedDialog } from "./sceneHistory";

function findClosestBgImage(dialogs: ExtendedDialog[]) {
    const findClosestBgImage = dialogs.map((d) => d.BG_ImageName).find((b) => b);
    return findClosestBgImage;
}

function DialogCard({
    dialog,
    current = false,
    children,
}: {
    dialog: ExtendedDialog;
    current?: boolean;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                "js-dialog relative flex min-h-[4rem] animate-dialog-appear flex-col justify-center rounded border bg-white bg-opacity-90 p-4 opacity-75 transition-opacity hover:opacity-100",
                { "js-current-dialog opacity-100": current },
            )}
        >
            <div className="flex flex-col gap-1">
                {dialog.speaker?.name && <span className="font-bold">{dialog.speaker.name}</span>}
                <div
                    className="break-all leading-normal"
                    style={{ minHeight: "calc(1em * 2 * 1.5)" }}
                    dangerouslySetInnerHTML={{ __html: convertScriptTextToHtml(dialog.Script) }}
                />
                {children}
            </div>
        </div>
    );
}

function CurrentActions({
    dialog,
    focusRef,
    onAdvance,
    onSelect,
}: {
    dialog: ExtendedDialog;
    focusRef: (element: HTMLElement | null) => void;
    onAdvance: (keyboard: boolean) => void;
    onSelect: (index: number, keyboard: boolean) => void;
}) {
    if (dialog.SelectionIndex.length > 0) {
        return (
            <>
                {dialog.SelectionIndex.map((text, index) => (
                    <button
                        key={index}
                        ref={index === 0 ? focusRef : undefined}
                        type="button"
                        className={cn(
                            "cursor-pointer rounded-md border p-2 text-left font-bold text-orange-400",
                            { "bg-orange-600 text-white": dialog.SelectionSelectedIndex === index },
                        )}
                        onClick={(event) => {
                            onSelect(index, event.detail === 0);
                        }}
                    >
                        {text}
                    </button>
                ))}
            </>
        );
    }
    if (!dialog.hasNextDialog) {
        return <div className="select-none text-right text-sm">END</div>;
    }
    return (
        <button
            ref={focusRef}
            type="button"
            className="select-none border-b border-orange-400 border-opacity-0 text-right text-sm hover:border-opacity-100"
            onClick={(event) => {
                onAdvance(event.detail === 0);
            }}
        >
            NEXT
        </button>
    );
}

export function SceneViewer({ scene }: PageContext["pageProps"]) {
    const [history, setHistory] = useState<ExtendedDialog[]>(() => {
        const firstDialog = scene[0];
        if (!firstDialog) throw new Error("no dialogs");
        return [parseDialog(firstDialog)];
    });
    const focusTarget = useRef<HTMLElement | null>(null);
    const viewer = useRef<HTMLDivElement | null>(null);
    const current = history[0];
    if (!current) throw new Error("no dialogs");

    const updateHistory = (nextHistory: ExtendedDialog[], keyboard: boolean) => {
        // 遷移先の操作要素を描画してから、同じイベント内でフォーカスを移す。
        flushSync(() => {
            setHistory(nextHistory);
        });
        if (keyboard) focusTarget.current?.focus({ preventScroll: true });
    };

    const advance = (keyboard = false) => {
        const nextHistory = advanceHistory(scene, history);
        if (nextHistory !== history) updateHistory(nextHistory, keyboard);
    };

    const select = (index: number, keyboard: boolean) => {
        updateHistory(selectHistory(scene, history, index), keyboard);
    };

    const goBack = (index: number, keyboard: boolean) => {
        updateHistory(rewindHistory(history, index), keyboard);
        scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (
            event.defaultPrevented ||
            event.isComposing ||
            event.repeat ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
        )
            return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (target !== document.body && !viewer.current?.contains(target)) return;
        if (
            target instanceof Element &&
            (target.closest("input, textarea, select, [role='textbox'], [role='combobox']") ||
                (target instanceof HTMLElement && target.isContentEditable) ||
                (event.key === "Enter" &&
                    target.closest("button, a[href], summary, [role='button'], [role='link']")))
        )
            return;
        if (event.key === "Enter" && (current.SelectionIndex.length > 0 || current.hasNextDialog)) {
            event.preventDefault();
            advance(true);
        } else if (event.key === "Backspace" && history.length > 1) {
            event.preventDefault();
            goBack(1, true);
        }
    };

    const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
    const bgImages = new Set([...new Set(scene.map((d) => d.BG_ImageName))].filter((e) => e));
    const cutImages = new Set(
        [...new Set(scene.map((d) => d.Add_ImageName))]
            .filter((e) => e)
            // ゼロ幅スペースを削除
            .map((d) => d.replace(/\u200B/g, "")),
    );

    // bg imageは最後のものを表示する
    const closetBgImage = findClosestBgImage(history);
    // cut imageはその時指定されているものだけ表示する
    const currentCutImage = current.Add_ImageName // ゼロ幅スペースを削除
        .replace(/\u200B/g, "");

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-24">
            <div
                className="flex flex-col"
                role="region"
                aria-label="シーンビューア"
                ref={(element) => {
                    viewer.current = element;
                    document.removeEventListener("keydown", handleKeyDown);
                    if (element) document.addEventListener("keydown", handleKeyDown);
                }}
            >
                <div
                    className="relative z-10 aspect-video max-h-80 w-full select-none overflow-hidden rounded-b bg-slate-500"
                    onClick={() => {
                        advance();
                    }}
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
                    {history.map((dialog, index) => (
                        <DialogCard
                            key={history.length - index}
                            dialog={dialog}
                            current={index === 0}
                        >
                            {index === 0 ? (
                                <CurrentActions
                                    dialog={dialog}
                                    focusRef={(element) => {
                                        focusTarget.current = element;
                                    }}
                                    onAdvance={advance}
                                    onSelect={select}
                                />
                            ) : dialog.SelectionIndex.length > 0 ? (
                                dialog.SelectionIndex.map((text, selectionIndex) => (
                                    <button
                                        key={selectionIndex}
                                        type="button"
                                        className={cn(
                                            "cursor-pointer rounded-md border p-2 text-left font-bold text-orange-400",
                                            {
                                                "bg-orange-600 text-white":
                                                    dialog.SelectionSelectedIndex ===
                                                    selectionIndex,
                                            },
                                        )}
                                        onClick={(event) => {
                                            goBack(index, event.detail === 0);
                                        }}
                                    >
                                        {text}
                                    </button>
                                ))
                            ) : (
                                <button
                                    type="button"
                                    className="select-none border-b border-orange-400 border-opacity-0 text-right text-sm hover:border-opacity-100"
                                    onClick={(event) => {
                                        goBack(index, event.detail === 0);
                                    }}
                                >
                                    BACK
                                </button>
                            )}
                        </DialogCard>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 px-2">
                <h2 className="text-2xl">Transcription</h2>
                <ol className="list-outside list-decimal rounded border p-4 pl-10 text-sm text-gray-600">
                    {scene.map((d, i) => {
                        const dialog = parseDialog(d);
                        const speaker = dialog.speaker?.name && (
                            <>
                                <span className="">{dialog.speaker.name}</span>
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
