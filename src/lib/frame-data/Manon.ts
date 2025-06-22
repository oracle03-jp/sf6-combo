import type { ComboCategory } from "../types";

const comboData: ComboCategory[] = [
    {
        type: "基本コンボ",
        combos: [
            {
                sequence: "立中P > CR > 屈中P > 引大P > 中ランヴェルセ",
                damage: "2480dmg(メダルLv1)",
                frame: "+15F",
                notes: "確定反撃"
            },
            {
                sequence: "引大P > ODグランフェッテ > 引大P > 強ポワン > 弱ランヴェルセ",
                damage: "2480dmg(メダルLv1)",
                frame: "+15F",
                notes: "確定反撃"
            },
        ]
    },
    {
        type: "画面端コンボ",
        combos: [
            {
                sequence: "ジャンプ強K > 弱K > 昇龍拳",
                damage: "2800",
                frame: "15",
                notes: "カウンター時限定"
            },
                        {
                sequence: "ジャンプ強K > 弱K > 昇龍拳",
                damage: "2800",
                frame: "15",
                notes: "カウンター時限定"
            },
        ]
    },
    {
        type: "インパクト関連コンボ",
        combos: [
            {
                sequence: "",
                damage: "",
                frame: "",
                notes: ""
            }
        ]
    }
];

export default comboData;