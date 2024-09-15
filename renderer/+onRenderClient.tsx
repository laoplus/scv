import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import type { PageContextBuiltInClient } from "vike/client";

import { createPageMeta } from "./createPageMeta";
import { PageShell } from "./PageShell";
import type { PageContext } from "./types";

export { render as onRenderClient };
export { onHydrationEnd };

export { onPageTransitionStart };
export { onPageTransitionEnd };

let root: ReactDOM.Root;
async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { Page, pageProps } = pageContext;
  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );
  const container = document.getElementById("page-view")!;
  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(page);
  }

  // update title and description
  const meta = pageContext.exports.getDocumentProps
    ? createPageMeta(pageContext.exports.getDocumentProps(pageContext))
    : createPageMeta(pageContext.exports.documentProps);
  updateMetaTags(meta);
}

function updateMetaTags({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const titleElement = document.querySelector("title")!;
  const descriptionElement = document.head.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  )!;
  const ogTitleElement = document.head.querySelector<HTMLMetaElement>(
    'meta[property="og:title"]',
  )!;
  const ogDescriptionElement = document.head.querySelector<HTMLMetaElement>(
    'meta[property="og:description"]',
  )!;

  titleElement.textContent = title;
  descriptionElement.content = description;
  ogTitleElement.content = title;
  ogDescriptionElement.content = description;
}

function onHydrationEnd() {
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

function onPageTransitionStart() {
  console.time("transition");
  console.log("Page transition start");
  document.querySelector("main")!.classList.add("page-transition");
}

function onPageTransitionEnd() {
  console.timeEnd("transition");
  console.log("Page transition end");
  document.querySelector("main")!.classList.remove("page-transition");
}
