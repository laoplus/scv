import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
    server: { port: 3080 },
    plugins: [
        react(),
        AutoImport({
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
