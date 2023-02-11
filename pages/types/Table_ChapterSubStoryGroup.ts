export type ChapterSubStoryGroup = {
    Key: string;
    ChapterIndex: string;
    StoryPCNo: string;
    ChapterSubStoryIndex: string[];
    NumberOfStory: number;
    /**
     * 表示されるサブストーリーグループの名前
     * @example "美女は辛いよ"
     */
    PCName: string;
    PCInvenIconID: string;
};

export type TableChapterSubStoryGroup = {
    [key: string]: ChapterSubStoryGroup;
};
