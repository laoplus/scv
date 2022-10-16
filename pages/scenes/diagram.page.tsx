import React, { useEffect, useRef, useState } from "react";
import { Heading } from "../../components/Heading";
import { onBeforeRender } from "./diagram.page.server";
import mermaid from "mermaid";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

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
    mermaid.mermaidAPI.render("mermaid", mermaidSource, (svg) => {
      setMermaidResult(svg);
    });
  }, []);

  useEffect(() => {
    reactZoomPanPinchRef.current?.zoomOut();
  }, [mermaidResult]);

  return (
    <div className="px-4 md:mx-4 md:px-0 lg:mx-8">
      {/* TODO: コンポーネントに移す */}
      <div className="flex flex-col gap-2 py-12">
        <p className="opacity-70">
          <a
            href={
              chapter === "main"
                ? `/main/`
                : `/events/${chapter.replace("ev", "")}/`
            }
          >
            {eventName}
          </a>{" "}
          /{" "}
          <a
            href={
              chapter === "main"
                ? `/main/` // TODO
                : `/events/${chapter.replace("ev", "")}/#${chapter}-${stageIdx}`
            }
          >
            {stageIdx}
          </a>{" "}
          /{" "}
          <a href="../">
            {cutType} {stageName}
          </a>
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Diagram View (Beta)
        </h1>
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
              className="pt-4 pb-24"
              id="mermaid"
              dangerouslySetInnerHTML={{ __html: mermaidResult }}
            ></div>
          )}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
