import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", storage: "localStorage", env: process.env.NODE_ENV });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Export app for Vercel
  (app as any)._startServer = () => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Demo server running on http://localhost:${PORT} (LocalStorage Mode)`);
    });
  };

  return app;
}

const appPromise = startServer();

// For Vercel, we export the app handler
export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};

// For local/development, we start the listener
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  appPromise.then(app => {
    (app as any)._startServer();
  });
} else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  // Local production test
  appPromise.then(app => {
    (app as any)._startServer();
  });
}
