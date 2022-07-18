import React from "react";
import logo from "./logo.svg";
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
        <Layout>
          <Header />
          <Content>
            <div className="min-h-full">{children}</div>
            <Footer />
          </Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">{children}</div>
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

      {/* <Link className="navitem" href="/about">
        About
      </Link> */}
      <Link href="/main">
        Main<span className="hidden"> scenes</span>
      </Link>
      <Link href="/events">
        Event<span className="hidden"> scenes</span>
      </Link>
    </header>
  );
}

function Footer() {
  return (
    <footer>
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

function Content({ children }: { children: React.ReactNode }) {
  return <main className="overflow-x-auto">{children}</main>;
}
