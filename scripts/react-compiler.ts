import { transformSync } from "oxc-transform-react";
import type { Plugin } from "vite";

export function compileReact(source: string, filename: string) {
    const result = transformSync(filename, source, {
        sourcemap: true,
        jsx: "preserve",
        reactCompiler: {
            target: "18",
            panicThreshold: "all_errors",
        },
    });
    if (result.fatal || result.errors.length > 0) {
        throw new Error(`${filename}: ${JSON.stringify(result.errors)}`);
    }
    return { code: result.code, map: result.map };
}

export function reactCompiler(): Plugin {
    return {
        name: "scv:react-compiler",
        enforce: "pre",
        transform(source, id) {
            const filename = id.split("?")[0];
            if (
                id.includes("node_modules") ||
                id.startsWith("\0") ||
                !/\.[jt]sx?$/.test(filename) ||
                filename.endsWith(".d.ts")
            ) {
                return;
            }
            return compileReact(source, filename);
        },
    };
}
