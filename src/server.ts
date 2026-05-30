const distDir = new URL("../dist", import.meta.url).pathname;

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname === "/" ? "/index.html" : url.pathname;

    // Remove leading slash for Bun.file
    const fullPath = `${distDir}${filePath}`;
    const file = Bun.file(fullPath);

    if (await file.exists()) {
      return new Response(file);
    }

    // Fallback to index.html for SPA routing
    const indexFile = Bun.file(`${distDir}/index.html`);
    if (await indexFile.exists()) {
      return new Response(indexFile);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Dev server running at http://localhost:${server.port}`);
