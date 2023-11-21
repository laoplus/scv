import React from "react";

import { cn } from "./utils";

export const Heading = ({
  level,
  className,
  children,
}: {
  level: 1 | 2;
  className?: string;
  children: React.ReactNode;
}) => {
  switch (level) {
    default:
    case 1:
      return (
        <h1
          className={cn(
            "py-12 text-4xl font-extrabold tracking-tight text-gray-900",
            "px-4 md:px-0",
            className,
          )}
        >
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={cn("text-xl font-bold text-gray-900", className)}>
          {children}
        </h2>
      );
  }
};
