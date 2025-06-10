import type { ComboCategory } from "./types";

export async function getComboData(fileName: string): Promise<ComboCategory[]> {
  try {
    const data = await import(`./combo-data/${fileName}`);
    return data.default;
  } catch (error) {
    console.error("Failed to load combo data for", fileName, error);
    return [];
  }
}