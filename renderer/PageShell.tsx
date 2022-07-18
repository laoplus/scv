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
          <div className="min-h-full">{children}</div>
        </Content>
        <Footer />
      </PageContextProvider>
    </React.StrictMode>
  );
}
function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-2 bg-slate-800 p-2 text-gray-100">
      <div className="flex justify-between ">
        <div>
          <a href="/">
            <span className="font-bold text-amber-500">SCV</span>
          </a>
          <span className="hidden opacity-50"> - </span>
          <span className="hidden opacity-50">Last Origin Scenario Viewer</span>
        </div>
      </div>

      <Link href="/main">
        Main<span className="hidden"> scenes</span>
      </Link>
      <Link href="/events">
        Event<span className="hidden"> scenes</span>
      </Link>
    </header>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <main className="z-10 bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-400">
      {children}
    </main>
  );
}

function Footer() {
  return (
    <footer className="sticky top-[100vh]">
      <div className="flex flex-col justify-center gap-4 bg-slate-800 p-2 py-10 text-sm text-gray-300">
        <span>
          Made with <span className="text-rose-500">&lt;3</span> by the LAOPLUS.
        </span>
        <span>
          LAOPLUS is a fan-made service and is not licensed by PiG Corporation
          or SmartJoy Co., Ltd.
        </span>
        <span>&copy; PiG Corporation &amp; SmartJoy Co.,Ltd.</span>
      </div>
    </footer>
  );
}
