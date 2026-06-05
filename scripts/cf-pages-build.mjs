import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });

// Prevent Pages from picking up large .next cache files if output dir is misconfigured.
rmSync(".next", { recursive: true, force: true });
