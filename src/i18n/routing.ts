import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "te", "ta", "kn", "ml", "mr", "gu", "pa", "bn", "or", "as", "ur"],
  defaultLocale: "en",
  localeDetection: true,
});
