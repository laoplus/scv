import React from "react";
import { Scenario } from "./types/Scenario";

export { Page };

function Page({ s }: { s: Scenario }) {
  if (!s[0]) {
    return <p>no dialogs...</p>;
  }

  return (
    <>
      <h1>{s[0].Dialog_Group}</h1>

      <h2>Dialog</h2>
      <ul>
        {s.map((s) => (
          <li key={s.Key}>{s.Script}</li>
        ))}
      </ul>
    </>
  );
}
