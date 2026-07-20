import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { makeBadge } from "badge-maker";
import { version } from "../package.json" with { type: "json" };

const target = resolve(dirname(fileURLToPath(import.meta.url)), "../badge.svg");

const svg = makeBadge({
  label: "Version",
  message: version,
  color: "#2ea44f",
});

writeFileSync(target, svg);
