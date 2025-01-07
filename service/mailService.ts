import nodemailer from "nodemailer";

type sendMailProps = {
  subject: string;
  email: string;
  html: string;
};

export async function sendMail({ subject, email, html }: sendMailProps) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  const mailOptions = {
    from: `CEMS <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject,
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
