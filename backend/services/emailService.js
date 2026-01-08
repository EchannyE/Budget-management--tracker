import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, htmlMessage) => {
  let transporter;

  try {
    /* ============================
       DEVELOPMENT (ETHEREAL)
    ============================ */
    if (process.env.NODE_ENV !== "production") {
      console.log("📧 Email Mode: DEVELOPMENT (Ethereal)");

      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
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

    /* ============================
       PRODUCTION (SENDGRID)
    ============================ */
    console.log("📧 Email Mode: PRODUCTION (SendGrid)");

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.verify();
    console.log("✅ SMTP connection verified");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM, 
      to,
      subject,
      html: htmlMessage,
    });

    console.log(`✅ Email successfully sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed");
    console.error(error);
    throw new Error("Email could not be sent");
  }
};
