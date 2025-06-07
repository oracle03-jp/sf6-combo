import type { Combo } from "./types";

export async function getComboData(name: string): Promise<Combo[]> {
    try {
        const data = await import(`./combo-data/${name}`);
        return data.default;
    } catch {
        return [];
    }
}