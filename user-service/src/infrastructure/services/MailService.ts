import nodemailer from "nodemailer";

export class MailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: "TritZ",
        to,
        subject,
        text,
        html,
      });
    } catch (err) {
      console.log(`[MailService]: ${err}`);
      throw Object.assign(new Error("Error while sending mail"), {
        statusCode: 503,
      });
    }
  }
}
