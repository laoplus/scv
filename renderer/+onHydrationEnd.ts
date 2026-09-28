import * as Sentry from "@sentry/react";

export function onHydrationEnd() {
    console.log("Hydration finished; page is now interactive.");
    console.log(
        "Elements included in the current page:",
        document.body.querySelectorAll(`*:not(script, link)`).length,
    );

    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 1.0,
        integrations: [Sentry.replayIntegration()],
        tracesSampleRate: 1.0,
    });
}
