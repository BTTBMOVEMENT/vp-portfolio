import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const HERO_DIR = path.join(process.cwd(), "public", "images", "hero");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export async function GET() {
  try {
    const dirEntries = await fs.readdir(HERO_DIR, { withFileTypes: true });

    const frames = dirEntries
      .filter((entry) => {
        if (!entry.isFile()) return false;
        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) return false;
        return /^hero\d+\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name);
      })
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((fileName) => `/images/hero/${fileName}`);

    return Response.json({ frames });
  } catch {
    return Response.json({ frames: [] });
  }
}