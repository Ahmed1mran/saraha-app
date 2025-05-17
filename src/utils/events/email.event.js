import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { confirmEmailTemplateOTP } from "../email/template/confirmEmailOTP.js";
import { confirmEmailTemplateToken } from "../email/template/confirmEmailToken.js";
import { generateToken } from "../security/token.js";
import userModel from "../../DB/model/User.model.js";
import { generateHash } from "../security/hash.js";

export const emailEvent = new EventEmitter();


emailEvent.on("sendConfirmEmailWithToken", async ({ email } = {}) => {
  const emailToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNTURE,
  });
  const emailLink = `${process.env.FE_URL}/confirm-email/${emailToken}`;
  const html = confirmEmailTemplateToken({ link: emailLink });
  await sendEmail({ to: email, subject: "confirm email", html });
});
emailEvent.on("sendConfirmEmailWithOTP", async ({ email } = {}) => {
  try {
    const otp = customAlphabet("0123456789", 4)();
    const html = confirmEmailTemplateOTP({ code: otp });
    const emailOTP = generateHash({ plainText: `${otp}` });

    await userModel.updateOne({ email }, { emailOTP });
    await sendEmail({ to: email, subject: "Confirm Email", html });

    console.log("Email Sent");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
});emailEvent.on("sendForgetPassword", async ({ email } = {}) => {
  try {
    const otp = customAlphabet("0123456789", 4)();
    const html = confirmEmailTemplateOTP({ code: otp });
    const forgetPasswordOTP = generateHash({ plainText: `${otp}` });

    await userModel.updateOne({ email }, { forgetPasswordOTP });
    await sendEmail({ to: email, subject: "Forget-Password", html });

    console.log("Email Sent");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
});
