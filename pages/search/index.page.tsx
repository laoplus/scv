import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { cn, convertScriptTextToHtml } from "../../components/utils";
import { UnitIcon } from "../../components/UnitIcon";
import { Heading } from "../../components/Heading";
import { toHiragana } from "./util";

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

const NotFound = () => {
  const notFoundIcons = [
    "https://cdn.laoplus.net/sticker/Diyap04_4.webp",
    "https://cdn.laoplus.net/sticker/Diyap08_2.webp",
  ];

  return useMemo(
    () => (
      <div>
        <div className="flex flex-col items-center gap-2 bg-slate-200 p-6 py-12 text-center md:rounded-lg md:p-12">
          <img
            src={
              notFoundIcons[Math.floor(Math.random() * notFoundIcons.length)]
            }
            className="h-32 w-32 flex-shrink-0"
          />
          <h2 className="text-xl font-bold [&>span]:inline-block [&>span]:whitespace-nowrap">
            <span>指定した</span>
            <span>キーワードを</span>
            <span>含む文章は</span>
            <span>見つかりませんでした</span>
          </h2>
        </div>
      </div>
    ),
    []
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

export function Page() {
  const [searchIndexLoading, setSearchIndexLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [searchIndex, setSearchIndex] = useState<SearchIndex[]>([]);

  useEffect(() => {
    (async () => {
      const d = (await fetch("./searchIndex.json").then((r) =>
        r.json()
      )) as SearchIndex[];

      setSearchIndex(d);
      setSearchIndexLoading(false);
    })();
  }, []);

  const searchResult = useCallback(() => {
    console.time("searchResult");
    const result = searchIndex.filter((d) => {
      const haystack = toHiragana(d.script.toLowerCase().normalize("NFKC"));
      const needle = toHiragana(
        searchString
          .toLowerCase()
          // SKK対応（！？）
          .replace(/▽|▼/gm, "")
          .normalize("NFKC")
      );
      return haystack.includes(needle);
    });
    console.timeEnd("searchResult");
    return result;
  }, [searchIndex, searchString])();

  return (
    <div className="md:mx-4 lg:mx-8">
      <Heading level={1}>Search</Heading>

      <div className="flex flex-col gap-2 px-4 md:px-0">
        <p className="">全シナリオの文章から全文検索ができます。</p>
        <p className="">
          {searchIndex.length.toLocaleString()}件のうち
          {searchResult.length.toLocaleString()}件を表示しています。
        </p>
      </div>

      <div className="sticky top-14 z-20 mt-6 shadow md:rounded-lg">
        <input
          type="search"
          disabled={searchIndexLoading}
          className={cn(
            "texm-sm block w-full !appearance-none rounded-none border-t border-b bg-white p-4  pr-12 text-slate-900 placeholder:text-slate-500 focus:outline-none md:rounded-lg md:border",
            searchIndexLoading && "cursor-not-allowed pl-11"
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

      <hr className="my-6 opacity-70" />

      {!searchIndexLoading &&
        (searchResult.length === 0 ? (
          <NotFound />
        ) : (
          <Virtuoso
            useWindowScroll
            data={searchResult}
            components={{
              List: React.forwardRef((props, ref) => (
                <div
                  {...props}
                  ref={ref}
                  className="flex flex-col gap-px border-t border-b border-gray-200 bg-gray-200 md:gap-2 md:border-none md:bg-white"
                />
              )),
            }}
            itemContent={(index, searchIndex) => (
              <Dialog d={searchIndex} key={index} />
            )}
            // overscan in pixels
            overscan={500}
          />
        ))}
    </div>
  );
}
