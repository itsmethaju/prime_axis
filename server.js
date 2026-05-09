const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  const { full_name, email, phone, service_interest, message } = req.body || {};

  if (!full_name || !email || !service_interest || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Prime Axis Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || "info@primeaxis.qa",
      replyTo: email,
      subject: `New Contact Message: ${service_interest}`,
      text: [
        `Full Name: ${full_name}`,
        `Email: ${email}`,
        `Phone: ${phone || "-"}`,
        `Service Interest: ${service_interest}`,
        "",
        "Message:",
        message
      ].join("\n")
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send email." });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`SMTP API running on port ${port}`);
});
