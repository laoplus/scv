// `usePageContext` allows us to access `pageContext` in any React component.
// More infos: https://vike.dev/pageContext-anywhere

import React, { useContext } from "react";

import type { PageContext } from "./types";

export { PageContextProvider, usePageContext };

const Context = React.createContext<PageContext | undefined>(undefined);

function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext;
    children: React.ReactNode;
}) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

function usePageContext() {
    const pageContext = useContext(Context);
    if (!pageContext) throw new Error("PageContextProvider is missing");
    return pageContext;
}
