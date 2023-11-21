import React from "react";
import ReactSelect, {
  components,
  DropdownIndicatorProps,
  OptionProps,
} from "react-select";

import { cn } from "../../components/utils";
import { SearchOption } from "./SelectorUtil";
import { toHiragana } from "./util";

const DropdownIndicator = (props: DropdownIndicatorProps<SearchOption>) => {
  return (
    <components.DropdownIndicator {...props}>
      <OcticonChevronDown24 className="h-6 w-6 text-slate-400" />
    </components.DropdownIndicator>
  );
};

const Option = (props: OptionProps<SearchOption>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between leading-tight">
        <div>{props.data.label}</div>
        <div className="shrink-0 rounded bg-gray-100 p-1 text-xs leading-none">
          {props.data.count.toLocaleString()}
        </div>
      </div>
    </components.Option>
  );
};

export const SceneSelector = ({
  searchIndexLoading,
  sceneOptions,
  setSearchSceneNames,
}: {
  searchIndexLoading: boolean;
  sceneOptions: SearchOption[];
  setSearchSceneNames: (sceneNames: (string | null)[]) => void;
}) => {
  return (
    <div className="relative shadow-sm">
      <ReactSelect
        inputId="speaker"
        instanceId={"speaker-select"}
        options={sceneOptions}
        onChange={(option) => {
          const v = option as SearchOption[];
          setSearchSceneNames(v.map((v) => v.value));
        }}
        isMulti={true}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        className={cn(
          "texm-sm block w-full !appearance-none rounded-none border-t border-b bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none md:rounded-lg md:border",
          searchIndexLoading && "cursor-not-allowed pl-11",
        )}
        placeholder={
          searchIndexLoading
            ? "検索インデックスを読み込み中..."
            : "シーンで絞り込む..."
        }
        components={{ DropdownIndicator, Option }}
        filterOption={(option, rawInput) => {
          const haystack = toHiragana(
            option.label.toLowerCase().normalize("NFKC"),
          );
          const needle = toHiragana(
            rawInput
              .toLowerCase()
              // SKK対応（！？）
              .replace(/▽|▼/gm, "")
              .normalize("NFKC"),
          );
          return haystack.includes(needle);
        }}
        styles={{
          control: (provided) => ({
            ...provided,
            border: "none",
            minHeight: "auto",
            padding: "1rem", // p-4
            borderRadius: 0,
            // tailwind breakpoint md:
            "@media (min-width: 768px)": {
              borderRadius: "0.5rem", // rounded-lg
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: 0,
            gap: "0.25rem", // gap-1
          }),
          input: (provided) => ({
            ...provided,
            margin: 0,
            padding: 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            margin: 0,
            color: "#64748b", // text-slate-500
          }),
          clearIndicator: () => ({
            display: "none",
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: 0,
          }),
          multiValue: (provided) => ({
            ...provided,
            margin: 0,
          }),
          menu: (provided) => ({
            ...provided,
            left: "1rem",
            right: "1rem",
            margin: 0,
            width: "auto",
            zIndex: 30,
          }),
        }}
      />
      {searchIndexLoading && (
        <div className="absolute top-0 left-5 bottom-0 flex animate-spin items-center text-slate-400">
          <OcticonSync24 className="h-5 w-5 -scale-x-100" />
        </div>
      )}
    </div>
  );
};

export const MemoSceneSelector = React.memo(SceneSelector);
