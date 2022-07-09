import * as ReactDOM from "react-dom/client";
import React from "react";
import { useClientRouter } from "vite-plugin-ssr/client/router";
import { PageShell } from "./PageShell";
import type { PageContext } from "./types";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/client";

let root: ReactDOM.Root;
const { hydrationPromise } = useClientRouter({
  render(pageContext: PageContextBuiltInClient & PageContext) {
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
  },
  // onTransitionStart,
  // onTransitionEnd,
});

hydrationPromise.then(() => {
  console.log("Hydration finished; page is now interactive.");
});
