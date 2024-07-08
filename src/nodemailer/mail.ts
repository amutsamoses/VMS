import * as nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  message: string
): Promise<string> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${subject}`,
      text: message,
      html: `<b>${message}</b>`,
    };

    const mailRes: nodemailer.SentMessageInfo =
      await transporter.sendMail(mailOptions);
    let mailResponse: string = "";
    if (mailRes.accepted.length > 0) {
      mailResponse = "Email sent successfully";
    } else if (mailRes.rejected.length > 0) {
      mailResponse = "Email rejected, please try again";
    } else {
      mailResponse = "Email not sent";
    }
    return mailResponse;
  } catch (error: any) {
    return JSON.stringify(error.message);
  }
};

export interface EmailOptions {
  email: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

// export interface EmailResponse {
//   accepted: string[];
//   rejected: string[];
//   response: string;
//   messageId: string;
// }

export interface MailResponse {
  accepted: string[];
  rejected: string[];
}

export const sendRegistrationEmail = async (
  userMail: string,
  eventName: string
): Promise<string> => {
  try {
    const subject: string = "Registration Successful";
    const message: string = `Thank you for registering for ${eventName}`;

    const mailRes: string = await sendEmail(userMail, subject, message);
    return mailRes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
