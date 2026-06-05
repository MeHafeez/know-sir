import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://sir-verification-portal.vercel.app/sitemap.xml",
    host: "https://sir-verification-portal.vercel.app",
  };
}
