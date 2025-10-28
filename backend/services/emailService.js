import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, message) => {
  try {
    console.log(` Preparing to send email to: ${to}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Budget Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: message,
    });

    console.log(` Email sent successfully to ${to}`);
  } catch (error) {
    console.error(" Error sending email:", error.message);
  }
};
