import React from "react";
import { Scene } from "../types/Scene";

export function Page({ scene }: { scene: Scene }) {
  if (!scene[0]) {
    return <p>no dialogs...</p>;
  }

  return (
    <>
      <h1>{scene[0].Dialog_Group}</h1>

      <h2>Dialog</h2>
      <ul>
        {scene.map((dialog) => (
          <li key={dialog.Key}>{dialog.Script}</li>
        ))}
      </ul>
    </>
  );
}
