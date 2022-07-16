import React, {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  ReactEventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { EventStories } from "../pages/events/index.page.server";
import { cn } from "./utils";

const UnitImage = ({
  src,
  ...props
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  const [hasRendered, setHasRendered] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (ref.current && hasRendered) {
      ref.current!.src = src || "";
    }
  }, [src, hasRendered]);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  /**
   * 本家素材がなかったらoriginal素材のパスをsrcに設定する
   */
  const onError1 = (e: SyntheticEvent<HTMLImageElement>) => {
    console.log("onerror1", e);
    //@ts-ignore
    e.currentTarget.onerror = onError2;
    const arr = e.currentTarget.src.split("/");
    arr.splice(3, 0, "original");
    e.currentTarget.src = arr.join("/");
  };
  /**
   * originalも見つからなかった時のフォールバック
   */
  const onError2 = (e: SyntheticEvent<HTMLImageElement>) => {
    console.log("onerror2", e);
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://cdn.laoplus.net/formationicon/FormationIcon_empty.webp";
  };

  return <img {...props} src={src} ref={ref} onError={onError1} />;
};

export function GridTableRenderer({
  eventIndexStr,
  stages,
}: {
  eventIndexStr: string;
  stages: EventStories[number][number]["ChapterStages"];
}) {
  return (
    <div className="grid grid-cols-[4px_max-content_minmax(10rem,1fr)] items-center gap-2">
      {stages.map((s) => (
        <div
          key={s.StageName}
          className={s.hasCutscene ? "contents" : "hidden"}
        >
          <div
            className={cn(
              "row-span-2 h-full min-h-[24px] rounded bg-yellow-500",
              {
                "bg-rose-500": s.StageSubTypeStr === "EX",
              },
              {
                "bg-lime-500": s.StageSubTypeStr === "SUB",
              }
            )}
          />
          <div className="pr-1">{s.StageIdxString}</div>
          <div>{s.StageName}</div>
          {/* 2列目 */}
          <div className="col-start-3 -mt-2 -mb-0.5 text-sm text-gray-600">
            {s.StageDesc}
          </div>
          {/* 3列目 */}
          <div className="contents">
            <div />
            {s.StartCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`/scenes/${eventIndexStr}/${s.StageIdxString}/op`.toLowerCase()}
                className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded border p-1 px-2 leading-[100%] text-sky-600"
              >
                OP
              </a>
            )}
            <div className="flex flex-wrap gap-1">
              {s.StartCutsceneCharcters.map((c, i) => {
                return (
                  <UnitImage
                    key={i}
                    title={c.name}
                    alt={c.name}
                    data-counts={c.counts}
                    data-filename={c.image}
                    src={
                      `https://cdn.laoplus.net/formationicon/` +
                      c.image
                        .replace("2DModel_", "FormationIcon_")
                        .replace("_DL_N", "")
                        .replace("_Commu", "_N") +
                      ".webp"
                    }
                    className="aspect-square w-10 rounded-sm"
                  />
                );
              })}
            </div>
          </div>
          <div className="contents">
            <div />
            {s.EndCutsceneIndex === "0" ? (
              "-"
            ) : (
              <a
                href={`/scenes/${eventIndexStr}/${s.StageIdxString}/ed`.toLowerCase()}
                className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded border p-1 px-2 leading-[100%] text-sky-600"
              >
                ED
              </a>
            )}
            <div className="flex flex-wrap gap-1">
              {s.EndCutsceneCharcters.map((c, i) => {
                return (
                  <UnitImage
                    key={i}
                    title={c.name}
                    alt={c.name}
                    data-counts={c.counts}
                    data-filename={c.image}
                    src={
                      `https://cdn.laoplus.net/formationicon/` +
                      c.image
                        .replace("2DModel_", "FormationIcon_")
                        .replace("_DL_N", "")
                        .replace("_Commu", "_N") +
                      ".webp"
                    }
                    className="aspect-square w-10 rounded-sm"
                  />
                );
              })}
            </div>
          </div>
          {s.MidCutsceneIndex.length !== 1 && s.MidCutsceneIndex[0] !== "0" && (
            <div className="col-span-full">
              {s.MidCutsceneIndex.map((sceneId, i) => (
                <a
                  key={sceneId}
                  href={`/scenes/${eventIndexStr}/${s.StageIdxString}/mid${
                    i + 1
                  }`.toLowerCase()}
                  className="inline-block p-1 text-sky-600"
                >
                  Mid {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
