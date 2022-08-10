import React from "react";
import ReactDOM from "react-dom/client";
import { PageShell } from "./PageShell";
import type { PageContext } from "./types";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client";

export const clientRouting = true;
export { render };
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
  // document.title = getPageTitle(pageContext);
}

function onHydrationEnd() {
  console.log("Hydration finished; page is now interactive.");
  console.log(
    "Elements included in the current page:",
    document.body.querySelectorAll(`*:not(script, link)`).length
  );
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
