import { execSync } from "node:child_process";
import { copyFileSync, cpSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });

const outDir = ".open-next";
const assetsDir = join(outDir, "assets");

// Pages advanced mode executes `_worker.js` (OpenNext writes `worker.js`).
copyFileSync(join(outDir, "worker.js"), join(outDir, "_worker.js"));

// Pages ASSETS serves from the output root, but OpenNext puts static files in /assets.
for (const entry of readdirSync(assetsDir)) {
  cpSync(join(assetsDir, entry), join(outDir, entry), { recursive: true, force: true });
}

rmSync(".next", { recursive: true, force: true });
