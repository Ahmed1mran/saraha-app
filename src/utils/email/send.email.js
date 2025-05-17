import nodemailer from "nodemailer";

export const sendEmail = async ({
  to = "",
  cc = "",
  bcc = "",
  subject = "Send Email Defult",
  text = "",
  html = "",
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `" VS Code Send Email 👻" <${process.env.EMAIL}>`, // sender address
    to,
    cc,
    bcc,
    text,
    html,
    subject,
    attachments,
  });
  return info;
};
