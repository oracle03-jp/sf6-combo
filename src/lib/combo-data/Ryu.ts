import type { ComboCategory } from "../types";

const comboData: ComboCategory[] = [
    {
        type: "画面中央",
        combos: [
            {
                sequence: "弱P > 中P > 昇龍拳",
                damage: "2200",
                frame: "12",
                notes: "確定反撃"
            },
        ]
    },
    {
        type: "画面端",
        combos: [
            {
                sequence: "ジャンプ強K > 弱K > 昇龍拳",
                damage: "2800",
                frame: "15",
                notes: "カウンター時限定"
            }
        ]
    }
];

export default comboData;