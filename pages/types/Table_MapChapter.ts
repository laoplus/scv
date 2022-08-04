export type TableMapChapter = {
    [key: string]: Chapter;
};

export type Chapter = {
    Key: string;
    /**
     * チャプター名
     * @example "地球上最後の人間"
     */
    ChapterName: string;
    /**
     * @value 0 = "main scenario"
     * @value 1 = "unused"
     * @value 2 = "unused"
     * @value 3 = "character scenario"
     * @value 4 = "event scenario"
     */
    GameModeType: number;
    StartCutsceneIndex: string;
    ChapterMapImg: string;
    ChapterString: string;
    Event_Category: string;
    Chapter_IDX: number;
    ChapterSearch_IDX: string;
    Chapter_3DWorldMap: string;
    Chapter_PrefabName: string;
};
