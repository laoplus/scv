import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { compileReact } from "./react-compiler.ts";

async function main() {
    let count = 0;
    for (const directory of ["components", "pages", "renderer"]) {
        for (const entry of await readdir(directory, {
            recursive: true,
            withFileTypes: true,
        })) {
            if (
                !entry.isFile() ||
                !/\.[jt]sx?$/.test(entry.name) ||
                entry.name.endsWith(".d.ts") ||
                entry.name.includes(".test.")
            )
                continue;
            const filename = join(entry.parentPath, entry.name);
            const source = await readFile(filename, "utf8");
            compileReact(source, filename);
            count++;
        }
    }
    console.log(`React Compiler: ${count} files passed.`);
}

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
