import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import vike from "vike/plugin";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    server: { port: 3080 },
    plugins: [
        react({ compiler: { target: "18", panicThreshold: "all_errors" } }),
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
        vike(),
    ],
});
