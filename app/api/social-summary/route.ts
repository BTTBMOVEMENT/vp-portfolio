import { getXPosts, getXProfileUrl } from "../../../lib/social";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const xResult = await getXPosts();
  const xLatest = xResult.posts[0];

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
  });
}