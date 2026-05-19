import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import fs from "fs/promises";

const app = express();

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
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 5000,
      socketTimeout: 5000,
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
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email", details: err.message });
  }
});

export default app;
