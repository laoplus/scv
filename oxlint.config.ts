import { readFileSync } from "node:fs";

import { defineConfig } from "oxlint";
import eslintRecommended from "oxlint-config-presets/@eslint/recommended.json" with { type: "json" };
import tsStrictTypeChecked from "oxlint-config-presets/@typescript-eslint/strict-type-checked.json" with { type: "json" };
import tsStylisticTypeChecked from "oxlint-config-presets/@typescript-eslint/stylistic-type-checked.json" with { type: "json" };
import importRecommended from "oxlint-config-presets/import/recommended.json" with { type: "json" };
import reactHooksRecommendedLatest from "oxlint-config-presets/react-hooks/recommended-latest.json" with { type: "json" };
import reactJsxRuntime from "oxlint-config-presets/react/jsx-runtime.json" with { type: "json" };
import reactRecommended from "oxlint-config-presets/react/recommended.json" with { type: "json" };

export default defineConfig({
    extends: [
        eslintRecommended,
        tsStrictTypeChecked,
        tsStylisticTypeChecked,
        importRecommended,
        reactRecommended,
        reactJsxRuntime,
        reactHooksRecommendedLatest,
    ],
    plugins: ["react", "typescript", "import"],
    options: { typeAware: true },
    ignorePatterns: ["dist/**", "data/**"],
    categories: { correctness: "error" },
    globals: (
        JSON.parse(
            readFileSync(new URL("./.oxlint-auto-import.json", import.meta.url), "utf8"),
        ) as { globals: Record<string, "readonly"> }
    ).globals,
    rules: {
        "no-restricted-imports": [
            "error",
            {
                paths: [{ name: "clsx", message: "components/utils.tsのcnを使用してください。" }],
                patterns: [
                    { group: ["clsx/*"], message: "components/utils.tsのcnを使用してください。" },
                ],
            },
        ],
        // `${number}個` みたいな使用を許可する
        "typescript/restrict-template-expressions": [
            "error",
            {
                allowNumber: true,
                allowBoolean: true,
                allowNullish: true,
            },
        ],
        "react/unsupported-syntax": "error",
        "react/no-deriving-state-in-effects": "error",
        "react/invariant": "error",
        "react/rule-suppression": "error",
        "react/syntax": "error",
        "react/todo": "error",
        "react/capitalized-calls": "error",
        "react/exhaustive-effect-dependencies": "error",
        "react/memo-dependencies": "error",
    },
    overrides: [
        {
            files: ["components/utils.ts"],
            rules: { "no-restricted-imports": "off" },
        },
    ],
});
