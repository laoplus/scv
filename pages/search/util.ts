/**
 * 与えられた文字列内のカタカナをすべてひらがなに変換する
 */
export const toHiragana = (text: string) =>
    text.replace(/[ァ-ン]/g, (katakana) =>
        String.fromCharCode(katakana.charCodeAt(0) - 0x60),
    );
