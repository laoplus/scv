import ReactDOM from "react-dom/client";
import type { PageContextClient } from "vike/types";

import { createPageMeta } from "./createPageMeta";
import { PageShell } from "./PageShell";
import type { PageContext } from "./types";

export { render as onRenderClient };

let root: ReactDOM.Root | undefined;
function render(pageContext: PageContextClient & PageContext) {
    const { Page, pageProps } = pageContext;
    const page = (
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    );
    const container = document.getElementById("page-view");
    if (!container) throw new Error("Missing page-view container");
    if (pageContext.isHydration) {
        root = ReactDOM.hydrateRoot(container, page);
    } else {
        root ??= ReactDOM.createRoot(container);
        root.render(page);
    }

    // update title and description
    const meta = pageContext.exports.getDocumentProps
        ? createPageMeta(pageContext.exports.getDocumentProps(pageContext))
        : createPageMeta(pageContext.exports.documentProps);
    updateMetaTags(meta);
}

function updateMetaTags({ title, description }: { title: string; description: string }) {
    const titleElement = document.querySelector("title");
    const descriptionElement = document.head.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
    );
    const ogTitleElement = document.head.querySelector<HTMLMetaElement>(
        'meta[property="og:title"]',
    );
    const ogDescriptionElement = document.head.querySelector<HTMLMetaElement>(
        'meta[property="og:description"]',
    );

    if (!titleElement || !descriptionElement || !ogTitleElement || !ogDescriptionElement) {
        throw new Error("Missing document metadata elements");
    }
    titleElement.textContent = title;
    descriptionElement.content = description;
    ogTitleElement.content = title;
    ogDescriptionElement.content = description;
}
