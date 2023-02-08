import clsx from "clsx";
import React from "react";

import { usePageContext } from "./usePageContext";

export { Link };

function Link(props: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const isActive = pageContext.urlPathname === props.href;

  return (
    <a
      {...props}
      className={clsx(
        "rounded-md px-3 py-2 text-sm font-medium uppercase",
        props.className,

        isActive
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      )}
    />
  );
}
