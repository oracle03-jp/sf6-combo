import type { FrameData } from "./types";

export async function getFrameData(fileName: string): Promise<FrameData[]> {
    try {
        const data = await import(`./frame-data/${fileName}`);
        return data.default;
    } catch (error) {
        console.error("Failed to load frame data for", fileName, error);
        return [];
    }
}