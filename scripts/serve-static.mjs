import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8"
};

function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const target = path.resolve(root, "." + decoded);
  if (target !== root && !target.startsWith(root + path.sep)) return null;

  const candidates = [target];
  if (!path.extname(target)) candidates.push(target + ".html");
  if (decoded.endsWith("/")) candidates.unshift(path.join(target, "index.html"));
  for (const candidate of candidates) {
    try {
      if (fs.statSync(candidate).isFile()) return candidate;
      if (fs.statSync(candidate).isDirectory()) {
        const index = path.join(candidate, "index.html");
        if (fs.existsSync(index)) return index;
      }
    } catch {}
  }
  return null;
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  let pathname;
  try {
    pathname = new URL(request.url || "/", "http://127.0.0.1").pathname;
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }
  const file = resolveFile(pathname);
  if (!file) {
    const notFound = path.join(root, "404.html");
    if (fs.existsSync(notFound)) {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : fs.readFileSync(notFound));
    } else {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : "Not found");
    }
    return;
  }

  const basename = path.basename(file);
  const contentType = basename === "opengraph-image" ? "image/png" : (types[path.extname(file).toLowerCase()] || "application/octet-stream");
  response.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": fs.statSync(file).size,
    "X-Content-Type-Options": "nosniff"
  });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log("Serving the static export at http://127.0.0.1:" + port);
});
