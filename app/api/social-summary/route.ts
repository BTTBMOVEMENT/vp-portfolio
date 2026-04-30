import {
  getInstagramPosts,
  getInstagramProfileUrl,
  getXPosts,
  getXProfileUrl,
} from "../../../lib/social";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [xResult, instagramResult] = await Promise.all([
    getXPosts(),
    getInstagramPosts(),
  ]);

  const xLatest = xResult.posts[0];
  const instagramLatest = instagramResult.posts[0];

  return Response.json({
    x: {
      mode: xResult.mode,
      message: xResult.message,
      profileUrl: getXProfileUrl(),
      latest: xLatest
        ? {
            id: xLatest.id,
            text: xLatest.text,
            createdAt: xLatest.createdAt,
            mediaUrl: xLatest.mediaUrl,
            mediaType: xLatest.mediaType,
            permalink: xLatest.permalink,
          }
        : null,
    },
    instagram: {
      mode: instagramResult.mode,
      message: instagramResult.message,
      profileUrl: getInstagramProfileUrl(),
      latest: instagramLatest
        ? {
            id: instagramLatest.id,
            text: instagramLatest.text,
            createdAt: instagramLatest.createdAt,
            mediaUrl: instagramLatest.mediaUrl,
            mediaType: instagramLatest.mediaType,
            permalink: instagramLatest.permalink,
          }
        : null,
    },
  });
}