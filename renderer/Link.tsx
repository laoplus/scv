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
      className={clsx("rounded border p-2 uppercase", props.className, {
        underline: isActive,
      })}
    />
  );
}
