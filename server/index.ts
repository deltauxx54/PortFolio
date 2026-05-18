import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs/promises";

let metaUrl = '';
try {
  metaUrl = (new Function('return import.meta')() as any).url;
} catch (e) {}
const _filename = metaUrl ? fileURLToPath(metaUrl) : (typeof __filename !== 'undefined' ? __filename : '');
const _dirname = metaUrl ? path.dirname(_filename) : (typeof __dirname !== 'undefined' ? __dirname : '');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HMR_PORT = Number(process.env.HMR_PORT) || 24679;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  const DATA_FILE = path.join(process.cwd(), "portfolio_data.json");

  // GET portfolio endpoint
  app.get("/api/portfolio", async (_req, res) => {
    try {
      await fs.access(DATA_FILE);
      const data = await fs.readFile(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.json(null);
    }
  });

  // PUT portfolio endpoint
  app.put("/api/portfolio", async (req, res) => {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true });
    } catch (e: any) {
      console.error("Save portfolio failed:", e.message);
      res.status(500).json({ error: "Erreur lors de la sauvegarde" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || emailUser;

    if (!emailUser || !emailPass) {
      // Log only if no credentials configured yet
      console.log(`[Contact] ${name} <${email}>: ${message.substring(0, 80)}`);
      return res.json({ success: true });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // use TLS
        auth: { user: emailUser, pass: emailPass },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${emailUser}>`,
        to: emailTo,
        replyTo: email,
        subject: `Nouveau message de ${name} — Portfolio`,
        html: `
          <h2 style="color:#a855f7">Nouveau message depuis le portfolio</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
          <hr/>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      res.json({ success: true });
    } catch (err: any) {
      console.error("Email error:", err.message);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
    }
  });

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
