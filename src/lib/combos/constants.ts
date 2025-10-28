export const POSITION = { mid: "中央", corner: "画面端" } as const
export const STARTER = {
    light: "弱攻撃始動", medium: "中攻撃始動", heavy: "強攻撃始動", impact: "インパクト"
} as const
export const CONDITION = {
    normal: "通常", counter: "カウンター", punish_counter: "パニッシュカウンター",
    wall_splat: "壁やられ", stun: "スタン"
} as const

export type Position = keyof typeof POSITION
export type Starter  = keyof typeof STARTER
export type Cond     = keyof typeof CONDITION