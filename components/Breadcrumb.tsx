import React from "react";

export const Breadcrumb = ({
  levels,
}: {
  levels: {
    name: string;
    href: string;
  }[];
}) => {
  const joinner = <span> / </span>;
  const lastLevel = levels[levels.length - 1];

  return (
    <p className="opacity-70">
      {levels.map((level) => (
        <React.Fragment key={level.name}>
          <a href={level.href}>{level.name}</a>
          {level !== lastLevel && joinner}
        </React.Fragment>
      ))}
    </p>
  );
};
