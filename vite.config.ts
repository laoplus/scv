import react from "@vitejs/plugin-react";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import ssr from "vite-plugin-ssr/plugin";

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
