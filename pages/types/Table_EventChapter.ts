export type EventChapter = {
    Key: string;
    Event_Category: string;
    /**
     * イベント名
     * @example "至高の晩餐"
     */
    Event_CategoryName: string;
    Event_CategoryDesc: string;
    Event_CategoryPos: number;
    Event_CategoryIndex: number;
    Event_CategoryBanner: string;
    Event_CategoryIcon: string;
    Chapter_Key: string;
    StartCutsceneIndex: string;
    Event_OpenType: number;
};

export type TableEventChapter = {
    [key: string]: EventChapter;
};
