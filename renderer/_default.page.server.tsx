import React from "react";
import ReactDOMServer from "react-dom/server";
import type { PageContextBuiltIn } from "vite-plugin-ssr";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr";

import { createPageMeta } from "./createPageMeta";
import logoUrl from "./logo.svg";
import { PageShell } from "./PageShell";
import type { PageContext } from "./types";

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["documentProps", "pageProps"];

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  const meta = pageContext.exports.getDocumentProps
    ? createPageMeta(pageContext.exports.getDocumentProps(pageContext))
    : createPageMeta(pageContext.exports.documentProps);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="ja">
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" href="${logoUrl}" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="${meta.description}" />
            <title>${meta.title}</title>
            <meta name="twitter:card" content="summary" />
            <meta property="og:site_name" content="SCV" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="${
              import.meta.env.VITE_HOST_BASE_URL
            }/ogp.png" />
            <meta property="og:title" content="${meta.title}" />
            <meta property="og:description" content="${meta.description}" />
            <link href="https://rsms.me/inter/inter.css" rel="stylesheet">
        </head>
    <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
    </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
