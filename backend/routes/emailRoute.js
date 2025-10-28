import express from "express";
import { sendEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/email", async (req, res) => {
  try {
    console.log("📩 Incoming request body:", req.body); // ✅ Debug

   console.log("REQ BODY:", req.body);
console.log("HEADERS:", req.headers);

const body = req.body || {};
console.log("Parsed Body:", body);

const to = body.to;
const subject = body.subject;
const message = body.message;


    if (!to || !subject || !message) {
      return res.status(400).json({
        error: "Missing required fields (to, subject, message)",
      });
    }

    await sendEmail(to, subject, message);
    console.log(`✅ Email sent to ${to}`);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
