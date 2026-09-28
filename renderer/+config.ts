import type { Config } from "vike/types";

export default {
    clientRouting: true,
    prerender: true,
    passToClient: ["documentProps", "pageProps"],
    meta: {
        documentProps: { env: { server: true, client: true } },
        getDocumentProps: { env: { server: true, client: true } },
    },
    hooksTimeout: {
        onBeforeRender: {
            warning: 10 * 1000,
            error: Infinity,
        },
    },
} satisfies Config;
