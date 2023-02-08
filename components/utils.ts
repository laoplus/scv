import clsx, { ClassValue } from "clsx";
import { overrideTailwindClasses } from "tailwind-override";

export const cn = (...classNames: ClassValue[]) => {
    return overrideTailwindClasses(clsx(...classNames));
};

export const convertScriptTextToHtml = (text: string) => {
    return (
        text
            // 改行
            .replace(/\n/g, "<wbr>")
            // [c][ffffff]のようなカラーコードの変換
            .replace(
                /\[c\]\s?\[(......)\]/g,
                `<mark style="color:#$1;font-weight:bold;">`
            )
            .replace(/\[-\]\[\/c\]/g, `</mark>`)
            // {0}の置換
            .replace("{0}", `<span style="opacity:0.7;">司令官</span>`)
    );
};
