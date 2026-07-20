import { type BuildOptions, build, context } from "esbuild";

const options: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outfile: "dist/index.js",
  sourcemap: true,
  // CJS deps (e.g. tunnel via @actions/http-client) still call require()
  banner: {
    js: `import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);`,
  },
  minify: true,
};

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build(options);
}
