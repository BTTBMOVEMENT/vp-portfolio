import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://bttbmovement.com/sitemap.xml",
    host: "https://bttbmovement.com",
  };
}