import { promises as fs } from "node:fs";
import path from "node:path";

export type VisionEntry = {
  id: string;
  title: string;
  image: string;
  alt: string;
  year: string;
  tags: string[];
  note?: string;
};

const VISION_DIR = path.join(process.cwd(), "public", "images", "vision");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function humanizeFilename(fileName: string) {
  const name = path.parse(fileName).name;

  return name
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function readOptionalNote(baseName: string) {
  const txtPath = path.join(VISION_DIR, `${baseName}.txt`);

  try {
    const value = await fs.readFile(txtPath, "utf8");
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

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
        const baseName = path.parse(file.name).name;
        const note = await readOptionalNote(baseName);

        return {
          id: baseName,
          title: humanizeFilename(file.name),
          image: `/images/vision/${file.name}`,
          alt: humanizeFilename(file.name),
          year: String(new Date(stats.mtimeMs).getFullYear()),
          tags: [],
          note,
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