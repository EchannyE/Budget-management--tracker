import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Set SendGrid API key if in production
if (isProduction) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = async (to, subject, htmlMessage) => {
  try {
    if (!isProduction) {
      console.log("📧 Email Mode: DEVELOPMENT (Ethereal)");

      // Create test account
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Budget Tracker" <${testAccount.user}>`,
        to,
        subject,
        html: htmlMessage,
      });

      console.log("✅ Email accepted by Ethereal");
      console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
      return;
    }

    console.log("📧 Email Mode: PRODUCTION (SendGrid API)");

    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      html: htmlMessage,
    });

    console.log(`✅ Email successfully sent to ${to} via SendGrid API`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};
