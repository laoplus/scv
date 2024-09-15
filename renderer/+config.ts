import type { Config } from "vike/types";

export default {
    clientRouting: true,
    hooksTimeout: {
        onBeforeRender: {
            warning: 10 * 1000,
            error: Infinity,
        },
    },
} satisfies Config;
