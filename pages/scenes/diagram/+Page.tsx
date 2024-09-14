import mermaid from "mermaid";
import React, { useEffect, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import { Breadcrumb } from "../../../components/Breadcrumb";
import { Heading } from "../../../components/Heading";
import { onBeforeRender } from "./+onBeforeRender";

type PageContext = Awaited<ReturnType<typeof onBeforeRender>>["pageContext"];

mermaid.initialize({});

export function Page({
  mermaidSource,
  cutSceneIndex,
  cutType,
  eventName,
  stageDescription,
  stageIdx,
  stageName,
  chapter,
}: PageContext["pageProps"]) {
  const [mermaidResult, setMermaidResult] = useState("");
  const reactZoomPanPinchRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    (async () => {
      const { svg } = await mermaid.render("mermaid", mermaidSource);
      setMermaidResult(svg);
    })();
  }, [mermaidSource]);

  useEffect(() => {
    reactZoomPanPinchRef.current?.zoomOut();
  }, [mermaidResult]);

  return (
    <div className="px-4 md:mx-4 md:px-0 lg:mx-8">
      <div className="flex flex-col gap-2 py-12">
        <Breadcrumb
          levels={[
            {
              name: `${chapter.toUpperCase()} ${eventName}`,
              href:
                chapter === "main"
                  ? `/main/`
                  : `/events/${chapter.replace("ev", "")}/`,
            },
            {
              name: `${stageIdx} ${stageName}`,
              href:
                chapter === "main"
                  ? `/main/` // TODO
                  : `/events/${chapter.replace(
                      "ev",
                      "",
                    )}/#${chapter}-${stageIdx}`,
            },
            {
              name: cutType,
              href: "../",
            },
          ]}
        />

        <Heading level={1} className={"py-0"}>
          Diagram View (Beta)
        </Heading>
      </div>

      <TransformWrapper maxScale={16} ref={reactZoomPanPinchRef}>
        <TransformComponent
          wrapperClass="!w-full bg-blue-50 rounded-lg max-h-screen"
          contentClass=""
        >
          {mermaidResult === "" ? (
            <div className="p-12">Rendering...</div>
          ) : (
            <div
              className="p-24"
              id="mermaid"
              dangerouslySetInnerHTML={{ __html: mermaidResult }}
            ></div>
          )}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
