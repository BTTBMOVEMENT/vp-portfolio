export type SocialPost = {
  id: string;
  platform: "x" | "instagram";
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
const X_API_BASE_URL = process.env.X_API_BASE_URL || "https://api.x.com/2";

const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME || "24minus0.024";
const META_GRAPH_BASE_URL =
  process.env.META_GRAPH_BASE_URL || "https://graph.facebook.com";
const META_GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

function formatXPermalink(username: string, id: string) {
  return `https://x.com/${username}/status/${id}`;
}

function parseXMedia(
  includes: any,
  attachments: any
): { mediaUrl?: string; mediaType?: string } {
  const mediaKeys: string[] | undefined = attachments?.media_keys;
  if (!mediaKeys || !includes?.media) return {};

  const first = includes.media.find((item: any) => mediaKeys.includes(item.media_key));
  if (!first) return {};

  return {
    mediaUrl: first.url || first.preview_image_url,
    mediaType: first.type,
  };
}

export async function getXPosts(): Promise<SocialFeedResult> {
  const token = process.env.X_BEARER_TOKEN;

  if (!token) {
    return {
      posts: [],
      mode: "setup-required",
      message:
        "Set X_BEARER_TOKEN in your environment to load your X timeline automatically.",
    };
  }

  try {
    const userResponse = await fetch(
      `${X_API_BASE_URL}/users/by/username/${encodeURIComponent(X_USERNAME)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!userResponse.ok) {
      return {
        posts: [],
        mode: "error",
        message: `X user lookup failed with status ${userResponse.status}.`,
      };
    }

    const userJson = await userResponse.json();
    const userId = userJson?.data?.id;

    if (!userId) {
      return {
        posts: [],
        mode: "error",
        message: "X user lookup returned no user id.",
      };
    }

    const postsResponse = await fetch(
      `${X_API_BASE_URL}/users/${userId}/tweets?max_results=10&tweet.fields=created_at,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,type`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!postsResponse.ok) {
      return {
        posts: [],
        mode: "error",
        message: `X timeline request failed with status ${postsResponse.status}.`,
      };
    }

    const postsJson = await postsResponse.json();

    const posts: SocialPost[] = (postsJson?.data || []).map((item: any) => {
      const media = parseXMedia(postsJson?.includes, item.attachments);

      return {
        id: item.id,
        platform: "x",
        text: item.text,
        permalink: formatXPermalink(X_USERNAME, item.id),
        createdAt: item.created_at,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      };
    });

    return {
      posts,
      mode: "live",
    };
  } catch (error) {
    return {
      posts: [],
      mode: "error",
      message:
        error instanceof Error ? error.message : "Unknown X API error.",
    };
  }
}

export async function getInstagramPosts(): Promise<SocialFeedResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return {
      posts: [],
      mode: "setup-required",
      message:
        "Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID to load Instagram posts automatically.",
    };
  }

  try {
    const response = await fetch(
      `${META_GRAPH_BASE_URL}/${META_GRAPH_VERSION}/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${encodeURIComponent(
        accessToken
      )}`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return {
        posts: [],
        mode: "error",
        message: `Instagram media request failed with status ${response.status}.`,
      };
    }

    const json = await response.json();

    const posts: SocialPost[] = (json?.data || []).map((item: any) => ({
      id: item.id,
      platform: "instagram",
      text: item.caption || "",
      permalink: item.permalink,
      createdAt: item.timestamp,
      mediaUrl: item.media_url || item.thumbnail_url,
      mediaType: item.media_type,
    }));

    return {
      posts,
      mode: "live",
    };
  } catch (error) {
    return {
      posts: [],
      mode: "error",
      message:
        error instanceof Error ? error.message : "Unknown Instagram API error.",
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

export function getInstagramProfileUrl() {
  return `https://instagram.com/${INSTAGRAM_USERNAME}`;
}

export function getXProfileUrl() {
  return `https://x.com/${X_USERNAME}`;
}