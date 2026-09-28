import { countBy } from "lodash-es";
import React, { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import { Heading } from "../../components/Heading";
import { UnitIcon } from "../../components/UnitIcon";
import { cn, convertScriptTextToHtml } from "../../components/utils";
import { filterSearchIndex } from "./filterSearchIndex";
import { MemoSceneSelector } from "./SceneSelector";
import { SearchOption } from "./SelectorUtil";
import { MemoSpeakerSelector } from "./SpeakerSelector";

export type SearchIndex = {
  key: string;
  speaker: {
    name: null | string;
    icon: null | string;
  };
  script: string;
  sceneName: string;
  path: string;
};

export const documentProps = {
  title: "検索",
  description: "ゲーム内の全シナリオの文章を全文検索できます。",
};

const NotFound = () => {
  const notFoundIcons = [
    "https://cdn.laoplus.net/sticker/Diyap04_4.webp",
    "https://cdn.laoplus.net/sticker/Diyap08_2.webp",
  ];

  const [icon] = useState(
    () => notFoundIcons[Math.floor(Math.random() * notFoundIcons.length)],
  );
  return (
    <div>
      <div className="flex flex-col items-center gap-2 bg-slate-200 p-6 py-12 text-center md:rounded-lg md:p-12">
        <img src={icon} className="h-32 w-32 flex-shrink-0" />
        <h2 className="text-xl font-bold [&>span]:inline-block [&>span]:whitespace-nowrap">
          <span>指定した</span>
          <span>キーワードを</span>
          <span>含む文章は</span>
          <span>見つかりませんでした</span>
        </h2>
      </div>
    </div>
  );
};

const Dialog = ({ d }: { d: SearchIndex }) => {
  const url = d.speaker.icon
    ? import.meta.env.VITE_CDN_BASE_URL +
      `/formationicon/FormationIcon_` +
      d.speaker.icon.replace("_DL_N", "").replace(/_[^_]*$/, "") +
      ".webp"
    : import.meta.env.VITE_CDN_BASE_URL +
      "/formationicon/FormationIcon_empty.webp";

  return (
    <div className="relative flex gap-3 bg-white p-4 transition-opacity hover:opacity-100 md:rounded md:border">
      <UnitIcon
        src={url}
        className="pointer-events-auto relative aspect-square h-10 w-10 flex-shrink-0 rounded"
        borderClassName="rounded"
        withInsetBorder={true}
        data-speakericon={d.speaker?.icon}
        data-speakerurl={url}
      />
      <div className="flex w-full min-w-0 flex-col justify-center gap-1.5">
        <div className="flex justify-between">
          <span className="truncate font-bold leading-none">
            {
              d.speaker.name || "\u00A0" // nbsp
            }
          </span>
          {/* スマホ以外(sm以上) 用 */}
          <a
            className="hidden text-sm leading-none underline-offset-4 opacity-50 hover:underline sm:inline"
            href={d.path}
          >
            {d.sceneName}
          </a>
        </div>
        <span
          className="leading-normal"
          dangerouslySetInnerHTML={{
            __html: convertScriptTextToHtml(d.script),
          }}
        />
        {/* スマホ用 */}
        <a
          className="text-sm leading-none underline-offset-4 opacity-50 hover:underline sm:hidden"
          href={d.path}
        >
          {d.sceneName}
        </a>
      </div>
    </div>
  );
};

const VirtuosoList = React.forwardRef(function VirtuosoWrapper(
  props: React.HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className="flex flex-col gap-px border-t border-b border-gray-200 bg-gray-200 md:gap-2 md:border-none md:bg-white"
    />
  );
});

export function Page() {
  const [searchIndexLoading, setSearchIndexLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [searchIndex, setSearchIndex] = useState<SearchIndex[]>([]);
  // speaker
  const [searchSpeakerNames, setSearchSpeakerNames] = useState<
    (string | null)[]
  >([]);
  const speakerOptions = useMemo(() => {
    const speakerNames = searchIndex.map((v) => v.speaker.name);
    const speakerCounts = Object.entries(countBy(speakerNames));
    const options = speakerCounts
      .map<SearchOption>(([speaker, count]) => ({
        // countByの時点でnullは"null"に変換されている
        label: speaker === "null" ? "(なし)" : speaker,
        value: speaker === "null" ? null : speaker,
        count,
      }))
      .sort((s1, s2) => s1.label.localeCompare(s2.label));
    return options;
  }, [searchIndex]);

  const [showSpeakerSelector, setShowSpeakerSelector] = useState(false);

  // scene
  const [searchSceneNames, setSearchSceneNames] = useState<(string | null)[]>(
    [],
  );
  const sceneOptions = useMemo(() => {
    const sceneNames = searchIndex.map((v) => v.sceneName);
    const sceneCounts = Object.entries(countBy(sceneNames));
    const options = sceneCounts
      .map<SearchOption>(([scene, count]) => ({
        // countByの時点でnullは"null"に変換されている
        label: scene === "null" ? "(なし)" : scene,
        value: scene === "null" ? null : scene,
        count,
      }))
      .sort((s1, s2) => s1.label.localeCompare(s2.label));

    return options;
  }, [searchIndex]);
  const [showSceneSelector, setShowSceneSelector] = useState(false);

  useEffect(() => {
    (async () => {
      const manifest = (await fetch("/searchIndex.manifest.json").then((r) =>
        r.json(),
      )) as { chunks: number };
      const chunks = await Promise.all(
        Array.from({ length: manifest.chunks }, (_, i) =>
          fetch(`/searchIndex.${i}.json`).then(
            (r) => r.json() as Promise<SearchIndex[]>,
          ),
        ),
      );

      setSearchIndex(chunks.flat());
      setSearchIndexLoading(false);
    })();
  }, []);

  const searchResult = useMemo(
    () =>
      filterSearchIndex(
        searchIndex,
        searchString,
        searchSpeakerNames,
        searchSceneNames,
      ),
    [searchIndex, searchString, searchSpeakerNames, searchSceneNames],
  );

  return (
    <div className="md:mx-4 lg:mx-8">
      <Heading level={1}>Search</Heading>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-4 md:px-0">
          <p className="">全シナリオの文章から全文検索ができます。</p>
          <p className="">
            {searchIndex.length.toLocaleString()}件のうち
            {searchResult.length === searchIndex.length
              ? "全"
              : searchResult.length.toLocaleString()}
            件を表示しています。
          </p>
        </div>

        <div className="flex flex-col gap-2 px-4 md:px-0 ">
          <p className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              id="speakerSelector"
              checked={showSpeakerSelector}
              onChange={(e) => {
                setSearchSpeakerNames((names) =>
                  names.length === 0 ? names : [],
                );
                setShowSpeakerSelector(e.target.checked);
              }}
            />
            <label htmlFor="speakerSelector">話者での絞り込みを使用する</label>
          </p>
        </div>

        {showSpeakerSelector && (
          <div className="flex flex-col gap-2 md:rounded-lg">
            <MemoSpeakerSelector
              searchIndexLoading={searchIndexLoading}
              setSearchSpeakerNames={setSearchSpeakerNames}
              speakerOptions={speakerOptions}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 px-4 md:px-0 ">
          <p className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              id="sceneSelector"
              checked={showSceneSelector}
              onChange={(e) => {
                setSearchSceneNames((names) =>
                  names.length === 0 ? names : [],
                );
                setShowSceneSelector(e.target.checked);
              }}
            />
            <label htmlFor="sceneSelector">シーンでの絞り込みを使用する</label>
          </p>
        </div>

        {showSceneSelector && (
          <div className="flex flex-col gap-2 md:rounded-lg">
            <MemoSceneSelector
              searchIndexLoading={searchIndexLoading}
              setSearchSceneNames={setSearchSceneNames}
              sceneOptions={sceneOptions}
            />
          </div>
        )}

        <div className="sticky top-14 z-20 flex flex-col gap-2 md:rounded-lg">
          <div className="relative shadow-sm">
            <input
              type="search"
              disabled={searchIndexLoading}
              className={cn(
                "texm-sm block w-full !appearance-none rounded-none border-t border-b bg-white p-4 pr-12 text-slate-900 placeholder:text-slate-500 focus:outline-none md:rounded-lg md:border",
                searchIndexLoading && "cursor-not-allowed pl-11",
              )}
              placeholder={
                searchIndexLoading
                  ? "検索インデックスを読み込み中..."
                  : "入力して検索..."
              }
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            {searchIndexLoading && (
              <div className="absolute top-0 left-5 bottom-0 flex animate-spin items-center text-slate-400">
                <OcticonSync24 className="h-5 w-5 -scale-x-100" />
              </div>
            )}
            <OcticonSearch24 className="absolute top-4 right-4 h-6 w-6 text-slate-400" />
          </div>
        </div>

        <hr className="my-6 opacity-70" />

        {!searchIndexLoading &&
          (searchResult.length === 0 ? (
            <NotFound />
          ) : (
            <Virtuoso
              useWindowScroll
              data={searchResult}
              components={{
                List: VirtuosoList,
              }}
              itemContent={(index, searchIndex) => (
                <Dialog d={searchIndex} key={index} />
              )}
              increaseViewportBy={500}
            />
          ))}
      </div>
    </div>
  );
}
