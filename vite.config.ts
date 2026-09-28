import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import ssr from "vike/plugin";
import { defineConfig } from "vite";

import { reactCompiler } from "./scripts/react-compiler";

// https://vitejs.dev/config/
export default defineConfig({
    server: { port: 3080 },
    plugins: [
        reactCompiler(),
        react(),
        AutoImport({
            eslintrc: {
                enabled: true,
                filepath: "./.oxlint-auto-import.json",
                globalsPropValue: "readonly",
            },
            resolvers: [
                IconsResolver({
                    prefix: "",
                    extension: "tsx",
                    enabledCollections: ["octicon"],
                }),
            ],
        }),
        Icons({
            compiler: "jsx",
            jsx: "react",
        }),
        ssr({ prerender: true }),
    ],
});
