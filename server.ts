import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAgentRouter } from "./server/agentRouter.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === "production";

  app.use(express.json({ limit: "15mb" }));

  // Server-side Gemini AI Agent API routes
  app.use("/api/agent", createAgentRouter());

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir, { extensions: ["html"] }));

    app.use((req, res) => {
      const routePath = req.path.replace(/^\/+|\/+$/g, "");
      const prerenderedPath = routePath
        ? path.join(distDir, routePath, "index.html")
        : path.join(distDir, "index.html");

      if (fs.existsSync(prerenderedPath)) {
        return res.sendFile(prerenderedPath);
      }
      return res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TextCase server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
