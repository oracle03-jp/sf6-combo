export type Combo = {
    sequence: string;
    damage: string;
    frame: string;
    notes: string;
};

export type ComboCategory = {
    type: string;
    combos: Combo[];
};