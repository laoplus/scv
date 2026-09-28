import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import react from "@vitejs/plugin-react";
import { transformSync } from "oxc-transform-react";
import { build } from "vite";

import { compileReact, reactCompiler } from "./react-compiler.ts";

const source = `
import React from "react";
export function Greeting({ name }: { name: string }) {
    return <p>Hello {name}</p>;
}
`;

test("React 18のランタイムで自動メモ化し、SSRでも描画できる", async () => {
    const result = compileReact(source, "Greeting.tsx");
    assert.match(result.code, /react-compiler-runtime/);
    assert.match(result.code, /\$\[0\] !== name/);
    assert.ok(result.map);
    const javascript = transformSync("Greeting.jsx", result.code, {
        reactCompiler: false,
        jsx: { runtime: "classic" },
    });
    assert.equal(javascript.fatal, false);
    const executable = javascript.code.replace(
        /from (["'])(react(?:-compiler-runtime)?)\1/g,
        (_, _quote: string, name: string) =>
            `from ${JSON.stringify(import.meta.resolve(name))}`,
    );
    const moduleSource = `${executable}
      import { renderToString } from ${JSON.stringify(import.meta.resolve("react-dom/server"))};
      export function renderGreeting(name) {
        return renderToString(React.createElement(Greeting, { name }));
      }
    `;
    const { renderGreeting } = await import(
        `data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`
    );
    assert.equal(renderGreeting("SCV"), "<p>Hello <!-- -->SCV</p>");
});

test("Compiler違反を黙ってスキップせずエラーにする", () => {
    assert.throws(() =>
        compileReact(
            `
        import { useState } from "react";
        export function Invalid() {
            const [value] = useState({ count: 0 });
            value.count++;
            return <p>{value.count}</p>;
        }
    `,
            "Invalid.tsx",
        ),
    );
});

test("OxlintのCompiler診断でレンダー中の乱数生成を検出する", async () => {
    const directory = await mkdtemp(join(tmpdir(), "scv-compiler-lint-"));
    const entry = join(directory, "Invalid.tsx");
    try {
        await writeFile(
            entry,
            `export function Invalid() { return <p>{Math.random()}</p>; }`,
        );
        const packageManager = process.env.npm_execpath;
        assert.ok(packageManager, "Run tests through the package.json scripts");
        const result = spawnSync(
            process.execPath,
            [packageManager, "run", "lint:compiler", "--", entry],
            { encoding: "utf8" },
        );
        assert.equal(result.status, 1);
        assert.match(result.stdout + result.stderr, /react\(purity\)/);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test("Viteのクライアント・SSRビルドの両方にCompilerが適用される", async () => {
    const directory = await mkdtemp(join(tmpdir(), "scv-compiler-"));
    const entry = join(directory, "Greeting.tsx");
    try {
        await writeFile(entry, source);
        for (const ssr of [false, true]) {
            const output = await build({
                configFile: false,
                logLevel: "silent",
                plugins: [reactCompiler(), react()],
                build: {
                    ssr,
                    write: false,
                    minify: false,
                    lib: { entry, formats: ["es"] },
                    rollupOptions: {
                        external: [
                            "react",
                            "react/jsx-runtime",
                            "react-compiler-runtime",
                        ],
                    },
                },
            });
            const outputs = Array.isArray(output) ? output : [output];
            const code = outputs
                .flatMap((result) => ("output" in result ? result.output : []))
                .filter((chunk) => chunk.type === "chunk")
                .map((chunk) => chunk.code)
                .join("\n");
            assert.match(code, /react-compiler-runtime/);
            assert.match(code, /\$\[0\] !== name/);
        }
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});
