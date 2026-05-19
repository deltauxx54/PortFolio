import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./app";

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const HMR_PORT = Number(process.env.HMR_PORT) || 24679;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: HMR_PORT } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
