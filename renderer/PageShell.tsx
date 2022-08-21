import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Header />
        <Content>
          <div className="mx-auto min-h-full max-w-7xl pb-12">{children}</div>
        </Content>
        <Footer />
      </PageContextProvider>
    </React.StrictMode>
  );
}
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-800 text-gray-100 shadow">
      <div className="mx-auto flex max-w-7xl items-center gap-2 p-2 md:px-8">
        <a href="/" className="flex h-8 items-center justify-between gap-1">
          <span className="font-bold tracking-wide text-amber-500">SCV</span>
          <span className="hidden text-sm opacity-50 lg:inline"> - </span>
          <span className="hidden text-sm opacity-50 lg:inline">
            Last Origin Scenario Viewer
          </span>
        </a>

        <Link href="/main/">Main</Link>
        <Link href="/events/">Event</Link>
        <Link href="/search/">Search</Link>
      </div>
    </header>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <main className="z-10 bg-white text-slate-700">{children}</main>;
}

function Footer() {
  return (
    <footer className="sticky top-[100vh] bg-slate-800 text-gray-300">
      <div className="mx-auto flex max-w-7xl flex-col justify-center gap-4 px-2 py-10 text-sm md:px-8">
        <span>
          Made with <span className="text-rose-500">&lt;3</span> by the LAOPLUS.
        </span>
        <span>
          SCV and LAOPLUS is not affiliated with or endorsed by PiG Corporation
          or SmartJoy Co., Ltd.
        </span>
        <span>&copy; PiG Corporation &amp; SmartJoy Co.,Ltd.</span>
      </div>
    </footer>
  );
}
