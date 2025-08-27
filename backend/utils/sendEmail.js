// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",        // use explicit SMTP host
    port: 465,                      // secure port
    secure: true,                   // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER, // your Gmail
      pass: process.env.SMTP_PASS, // your Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"Musicly Support" <${process.env.SMTP_USER}>`, // optional: branding
    to,
    subject,
    text,
  });
};

export default sendEmail;
