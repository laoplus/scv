import { readFileSync } from "node:fs";

import { defineConfig } from "oxlint";

export default defineConfig({
    plugins: ["react"],
    categories: { correctness: "error" },
    globals: JSON.parse(
        readFileSync(
            new URL("./.oxlint-auto-import.json", import.meta.url),
            "utf8",
        ),
    ).globals,
    rules: {
        "react/unsupported-syntax": "error",
        "react/no-deriving-state-in-effects": "error",
        "react/invariant": "error",
        "react/rule-suppression": "error",
        "react/syntax": "error",
        "react/todo": "error",
        "react/capitalized-calls": "error",
        "react/exhaustive-effect-dependencies": "error",
        "react/hooks": "error",
        "react/memo-dependencies": "error",
    },
});
