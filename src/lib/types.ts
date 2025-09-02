export type Combo = {
    sequence: string;
    damage: string;
    frame: string;
    notes: string;
};

export type ComboGroup = {
    label: string;
    combos: Combo[];
}

export type ComboCategory = {
    type: string;
    combos?: Combo[];
    groups?: ComboGroup[];
};

export type FrameData = {
    name: string;
    start: string;
    active: string;
    end: string;
    total: string;
}