import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const distDir = path.resolve(import.meta.dir, "dist");
const publicDir = path.resolve(import.meta.dir, "public");

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy public assets to dist
if (existsSync(publicDir)) {
  cpSync(publicDir, distDir, { recursive: true });
  console.log("✓ Copied public assets to dist/");
}

// Bundle JS (CSS is handled separately by Tailwind CLI)
const result = await Bun.build({
  entrypoints: [path.resolve(import.meta.dir, "src/index.tsx")],
  outdir: distDir,
  target: "browser",
  format: "esm",
  minify: true,
  sourcemap: "external",
  naming: {
    entry: "[dir]/[name]-[hash].[ext]",
    chunk: "[dir]/[name]-[hash].[ext]",
    asset: "[dir]/[name]-[hash].[ext]",
  },
  loader: {
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".gif": "file",
    ".svg": "file",
    ".woff": "file",
    ".woff2": "file",
    ".ttf": "file",
    ".eot": "file",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

if (!result.success) {
  console.error("✗ Build failed:");
  for (const msg of result.logs) {
    console.error(msg);
  }
  process.exit(1);
}

// Find generated JS file and update index.html
const jsFile = result.outputs.find((o) => o.path.endsWith(".js"));

if (jsFile) {
  const jsFileName = path.basename(jsFile.path);
  let html = readFileSync(path.resolve(import.meta.dir, "src/index.html"), "utf-8");
  html = html.replace('src="index.tsx"', `src="${jsFileName}"`);
  writeFileSync(path.resolve(distDir, "index.html"), html);
  console.log(`✓ JS: ${jsFileName}`);
}

console.log("✓ Build complete! Output in dist/");
