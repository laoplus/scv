export type TableMapStage = Record<string, Stage>;

export interface Stage {
    Key: string;
    StageName: string;
    StageDesc: string;
    ChapterIndex: string;
    NextStageIndex: string;
    StartCutsceneIndex: string;
    EndCutsceneIndex: string;
    StageSubType: number;
    StageIdxString: string;
    Stage_Pos: number;
    /**
     * 無いときは"0"が入っている
     */
    MidCutsceneIndex: string[];
    MidCutsceneWave: number[];
    MidCutsceneTiming: number[];
}
