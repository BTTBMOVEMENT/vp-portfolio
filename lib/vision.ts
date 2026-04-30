import { promises as fs } from "node:fs";
import path from "node:path";

export type VisionEntry = {
  id: string;
  title?: string;
  image: string;
  alt: string;
  year: string;
  tags: string[];
  note?: string;
};

const VISION_DIR = path.join(process.cwd(), "public", "images", "vision");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export async function getVisionEntries(): Promise<VisionEntry[]> {
  try {
    const dirEntries = await fs.readdir(VISION_DIR, { withFileTypes: true });

    const imageFiles = dirEntries.filter((entry) => {
      if (!entry.isFile()) return false;
      const ext = path.extname(entry.name).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext);
    });

    const items = await Promise.all(
      imageFiles.map(async (file) => {
        const absolutePath = path.join(VISION_DIR, file.name);
        const stats = await fs.stat(absolutePath);

        return {
          id: path.parse(file.name).name,
          image: `/images/vision/${file.name}`,
          alt: "Album frame",
          year: String(new Date(stats.mtimeMs).getFullYear()),
          tags: [],
          note: undefined,
          sortTime: stats.mtimeMs,
        };
      })
    );

    return items
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(({ sortTime, ...entry }) => entry);
  } catch {
    return [];
  }
}