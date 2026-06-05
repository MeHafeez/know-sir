import { MetadataRoute } from "next";

const locales = ["en", "hi", "te", "ta", "kn", "ml", "mr", "gu", "pa", "bn", "or", "as", "ur"];
const baseUrl = "https://sir-verification-portal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "en" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });
  }

  return routes;
}
