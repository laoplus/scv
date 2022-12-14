export type Scene = Dialog[];

export type Dialog = {
    Key: string;
    Dialog_Group: string;
    BG_Name: string;
    BG_Description: string;
    BG_ImageName: string;
    Dialog_Speaker: number;
    Char_ImageName_L: string;
    Char_Name_L: string;
    Char_AppearEffect_L: number;
    Char_ImageVarName_L: string;
    Char_AnimationAdd_L: string;
    Char_SCGActivation_L: number;
    Char_ImageName_R: string;
    Char_Name_R: string;
    Char_AppearEffect_R: number;
    Char_ImageVarName_R: string;
    Char_AnimationAdd_R: string;
    Char_SCGActivation_R: number;
    Char_ImageName_C: string;
    Char_Name_C: string;
    Char_AppearEffect_C: number;
    Char_ImageVarName_C: string;
    Char_AnimationAdd_C: string;
    Char_SCGActivation_C: number;
    Add_ImageName: string;
    Add_AppearEffect: number;
    Add_OffEffect: number;
    Script: string;
    SelectionIndex: string[];
    SelectionIndex_Next: string[];
    SelectionIndex_Cond: any[];
    SelectionIndex_CondValue1: number;
    SelectionIndex_CondValue2: number;
    Char_OffEffect_L: number;
    Char_OffEffect_R: number;
    Char_OffEffect_C: number;
    Screen_Effect: number;
    Add_Effect: string;
    NextDialogScript: string;
    Dialog_Reward: string;
    Voice_CharName: string;
    Script_VoiceName: string;
    Bgm_Sound: string;
};
