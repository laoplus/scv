export type ChapterSubStory = {
    Key: string;
    StoryNo: number;
    StoryName: string;
    StoryDialog: string;
    StoryCharIcon: string;
    DgUnlockCond: number;
    IsAndOrType: number;
    /**
     * 解放条件
     * @example "Ch01Ev14Stage10"
     */
    Param1: string;
    Param2: string;
    Param3: string;
    Param4: string;
    Param5: string;
};

export type TableChapterSubStory = {
    [key: string]: ChapterSubStory;
};
