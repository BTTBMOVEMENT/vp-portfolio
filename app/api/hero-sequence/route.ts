import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERO_DIR = path.join(process.cwd(), "public", "images", "hero");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

type FoundImage = {
  absolutePath: string;
  relativePath: string;
  fileName: string;
};

function extractFrameNumber(fileName: string) {
  const match = fileName.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

async function walkImages(dir: string, rootDir: string): Promise<FoundImage[]> {
  const results: FoundImage[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await walkImages(absolutePath, rootDir);
      results.push(...nested);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const relativePath = path
      .relative(rootDir, absolutePath)
      .split(path.sep)
      .join("/");

    results.push({
      absolutePath,
      relativePath,
      fileName: entry.name,
    });
  }

  return results;
}

export async function GET() {
  try {
    const images = await walkImages(HERO_DIR, HERO_DIR);

    const frames = images
      .sort((a, b) => {
        const frameDiff =
          extractFrameNumber(a.fileName) - extractFrameNumber(b.fileName);

        if (frameDiff !== 0) return frameDiff;

        return a.relativePath.localeCompare(b.relativePath, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      })
      .map((image) => `/images/hero/${image.relativePath}`);

    return Response.json({
      frames,
      count: frames.length,
      files: images.map((image) => image.relativePath),
    });
  } catch (error) {
    return Response.json({
      frames: [],
      count: 0,
      files: [],
      error: error instanceof Error ? error.message : "Unknown error",
      heroDir: HERO_DIR,
    });
  }
}