import { execSync } from "node:child_process";
import { cpSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });

const outDir = ".open-next";
const assetsDir = join(outDir, "assets");

// Pages ASSETS serves from the output root, but OpenNext puts static files in /assets.
for (const entry of readdirSync(assetsDir)) {
  cpSync(join(assetsDir, entry), join(outDir, entry), { recursive: true, force: true });
}

// Pages advanced mode routes EVERY request through `_worker.js` (unlike a Workers
// deployment, where static assets are served before the worker runs). The OpenNext
// `worker.js` has no static-asset handling, so `/_next/static/*` etc. would fall
// through to the Next.js handler and 404. This wrapper serves static assets from the
// Pages ASSETS binding first, then delegates everything else to OpenNext.
const wrapper = `import worker from "./worker.js";
export * from "./worker.js";

const STATIC_PREFIXES = ["/_next/", "/assets/"];
const STATIC_EXTENSIONS = [
  ".css", ".js", ".mjs", ".map", ".json", ".txt", ".xml", ".ico",
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg",
  ".woff", ".woff2", ".ttf", ".otf", ".eot",
];

function isStaticAsset(pathname) {
  if (STATIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (env.ASSETS && isStaticAsset(url.pathname)) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }
    return worker.fetch(request, env, ctx);
  },
};
`;
writeFileSync(join(outDir, "_worker.js"), wrapper);

rmSync(".next", { recursive: true, force: true });
