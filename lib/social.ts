export type SocialPost = {
  id: string;
  platform: "x";
  text: string;
  permalink: string;
  createdAt?: string;
  mediaUrl?: string;
  mediaType?: string;
};

export type SocialFeedResult = {
  posts: SocialPost[];
  mode: "live" | "setup-required" | "error";
  message?: string;
};

const X_USERNAME = process.env.X_USERNAME || "BTTBMovement";
const X_PROFILE_URL = `https://twitter.com/${X_USERNAME}`;
const X_SYNDICATION_URL = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${encodeURIComponent(
  X_USERNAME
)}`;

function extractNextDataJson(html: string) {
  const match = html.match(
    /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
  );

  if (!match?.[1]) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function walk(value: unknown, visitor: (node: Record<string, unknown>) => void) {
  const seen = new WeakSet();

  function inner(node: unknown) {
    if (!node || typeof node !== "object") return;
    if (seen.has(node as object)) return;

    seen.add(node as object);

    if (Array.isArray(node)) {
      for (const item of node) inner(item);
      return;
    }

    const record = node as Record<string, unknown>;
    visitor(record);

    for (const child of Object.values(record)) {
      inner(child);
    }
  }

  inner(value);
}

function collectTweetLikeObjects(root: unknown) {
  const candidates: Record<string, unknown>[] = [];

  walk(root, (node) => {
    const id =
      typeof node.id_str === "string"
        ? node.id_str
        : typeof node.rest_id === "string"
        ? node.rest_id
        : typeof node.id === "string"
        ? node.id
        : typeof node.id === "number"
        ? String(node.id)
        : null;

    const text =
      typeof node.full_text === "string"
        ? node.full_text
        : typeof node.text === "string"
        ? node.text
        : null;

    const createdAt =
      typeof node.created_at === "string" ? node.created_at : null;

    const looksLikeTweet =
      !!id &&
      !!text &&
      (!!createdAt ||
        "conversation_id_str" in node ||
        "favorite_count" in node ||
        "retweet_count" in node ||
        "entities" in node);

    if (looksLikeTweet) {
      candidates.push(node);
    }
  });

  return candidates;
}

function normalizeTweet(node: Record<string, unknown>): SocialPost | null {
  const id =
    typeof node.id_str === "string"
      ? node.id_str
      : typeof node.rest_id === "string"
      ? node.rest_id
      : typeof node.id === "string"
      ? node.id
      : typeof node.id === "number"
      ? String(node.id)
      : null;

  const text =
    typeof node.full_text === "string"
      ? node.full_text
      : typeof node.text === "string"
      ? node.text
      : null;

  if (!id || !text) return null;

  const user =
    typeof (node.user as any)?.screen_name === "string"
      ? (node.user as any).screen_name
      : X_USERNAME;

  const media =
    Array.isArray((node.extended_entities as any)?.media) &&
    (node.extended_entities as any).media.length > 0
      ? (node.extended_entities as any).media[0]
      : Array.isArray((node.entities as any)?.media) &&
        (node.entities as any).media.length > 0
      ? (node.entities as any).media[0]
      : null;

  const mediaUrl =
    typeof media?.media_url_https === "string"
      ? media.media_url_https
      : typeof media?.media_url === "string"
      ? media.media_url
      : undefined;

  const mediaType =
    typeof media?.type === "string" ? media.type : undefined;

  return {
    id,
    platform: "x",
    text,
    permalink: `https://twitter.com/${user}/status/${id}`,
    createdAt:
      typeof node.created_at === "string" ? node.created_at : undefined,
    mediaUrl,
    mediaType,
  };
}

export async function getXPosts(): Promise<SocialFeedResult> {
  try {
    const response = await fetch(X_SYNDICATION_URL, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        posts: [],
        mode: "error",
        message: `X timeline fetch failed with status ${response.status}.`,
      };
    }

    const html = await response.text();
    const nextData = extractNextDataJson(html);

    if (!nextData) {
      return {
        posts: [],
        mode: "error",
        message: "X timeline data could not be parsed from the embed response.",
      };
    }

    const candidates = collectTweetLikeObjects(nextData);
    const deduped = new Map<string, SocialPost>();

    for (const candidate of candidates) {
      const normalized = normalizeTweet(candidate);
      if (!normalized) continue;

      if (!deduped.has(normalized.id)) {
        deduped.set(normalized.id, normalized);
      }
    }

    const posts = Array.from(deduped.values())
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 12);

    if (posts.length === 0) {
      return {
        posts: [],
        mode: "error",
        message: "No X posts were extracted from the timeline response.",
      };
    }

    return {
      posts,
      mode: "live",
    };
  } catch (error) {
    return {
      posts: [],
      mode: "error",
      message:
        error instanceof Error ? error.message : "Unknown X timeline error.",
    };
  }
}

export function formatSocialDate(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function getXProfileUrl() {
  return X_PROFILE_URL;
}