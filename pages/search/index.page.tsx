import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { cn, convertScriptTextToHtml } from "../../components/utils";
import { UnitIcon } from "../../components/UnitIcon";

type SearchIndex = {
  filename: string;
  speaker: {
    name: string;
    icon?: string;
  };
  script: string;
};

const NotFound = () => {
  const notFoundIcons = [
    "https://lo.swaytwig.com/assets/webp/sticker/Diyap04_4.webp",
    "https://lo.swaytwig.com/assets/webp/sticker/Diyap08_2.webp",
  ];

  return useMemo(
    () => (
      <div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-200 p-6 py-12 text-center md:p-12">
          <img
            src={
              notFoundIcons[Math.floor(Math.random() * notFoundIcons.length)]
            }
            className="h-32 w-32 flex-shrink-0"
          />
          <h2 className="whitespace-nowrap text-xl font-bold">
            指定した
            <wbr />
            キーワードを
            <wbr />
            含む文章は
            <wbr />
            見つかりませんでした
          </h2>
        </div>
      </div>
    ),
    []
  );
};

const Dialog = ({ d }: { d: SearchIndex }) => {
  const url = d.speaker.icon
    ? `https://cdn.laoplus.net/formationicon/FormationIcon_` +
      d.speaker.icon.replace("_DL_N", "").replace(/_[^_]*$/, "") +
      ".webp"
    : "https://cdn.laoplus.net/formationicon/FormationIcon_empty.webp";

  return (
    <div className="relative flex min-h-[4rem] gap-1 rounded border bg-white bg-opacity-90 p-4 transition-opacity hover:opacity-100">
      <UnitIcon
        src={url}
        className="pointer-events-auto relative aspect-square h-10 w-10 flex-shrink-0"
        withInsetBorder={true}
        data-speakerIcon={d.speaker.icon}
        data-speakerUrl={url}
      />
      <div className="flex w-full flex-col justify-center">
        <div className="flex justify-between">
          <span className="font-bold">
            {
              d.speaker.name || "\u00A0" // nbsp
            }
          </span>
          <span className="text-sm opacity-50">{d.filename}</span>
        </div>
        <span
          className="leading-normal"
          dangerouslySetInnerHTML={{
            __html: convertScriptTextToHtml(d.script),
          }}
        />
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
    return searchIndex.filter((script) => script.script.includes(searchString));
  }, [searchIndex, searchString])();

  return (
    <div className="mx-4 md:mx-4 lg:mx-8">
      <h1 className="py-12 px-0 text-4xl font-extrabold tracking-tight text-gray-900">
        Search
      </h1>

      <p className="pb-6">全シナリオの文章から全文検索ができます。</p>
      <p>
        Showings {searchResult.length} items of {searchIndex.length} items.
      </p>

      <div className="relative rounded-lg shadow">
        <input
          type="search"
          disabled={searchIndexLoading}
          className={cn(
            "texm-sm block w-full appearance-none rounded-lg  border p-4 pr-12 text-slate-900 placeholder:text-slate-500 focus:outline-none",
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

      {searchString.length > 0 && (
        <>
          <hr className="my-6 opacity-70" />
          {searchResult.length === 0 ? (
            <NotFound />
          ) : (
            <Virtuoso
              style={{ height: "100vh", width: "100%" }}
              data={searchResult}
              components={{
                List: React.forwardRef((props, ref) => (
                  <div {...props} ref={ref} className="flex flex-col gap-2" />
                )),
              }}
              itemContent={(i, index) => <Dialog d={index} key={i} />}
              overscan={5}
            />
          )}
        </>
      )}
    </div>
  );
}
