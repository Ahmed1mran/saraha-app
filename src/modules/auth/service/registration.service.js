import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.js";
import { generateEncryption } from "../../../utils/security/encryption.js";
import { verifyToken } from "../../../utils/security/token.js";

export const signupWithToken = asyncHandler(async (req, res, next) => {
  const { userName, email, password, confirmPassword, phone } = req.body;

  if (password !== confirmPassword) {
    return next(
      new Error("Password mismatch comfirmationPassword", { cause: 400 })
    );
  }
  if (await userModel.findOne({ email })) {
    return next(new Error("Email Exists", { cause: 409 }));
  }
  const hashPassword = generateHash({ plainText: password, salt: 10 });
  const encryptphone = generateEncryption({ plainText: phone });
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone: encryptphone,
  });
  emailEvent.emit("sendConfirmEmailWithToken", { email });
  return successResponse({
    res,
    message: "user added successfully",
    data: { user },
    status: 201,
  });
});
export const signupWithOTP = asyncHandler(async (req, res, next) => {
  const { userName, email, password, confirmPassword, phone } = req.body;

  if (password !== confirmPassword) {
    return next(
      new Error("Password mismatch comfirmationPassword", { cause: 400 })
    );
  }
  if (await userModel.findOne({ email })) {
    return next(new Error("Email Exists", { cause: 409 }));
  }
  const hashPassword = generateHash({ plainText: password, salt: 10 });
  const encryptphone = generateEncryption({ plainText: phone });
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone: encryptphone,
  });
  emailEvent.emit("sendConfirmEmailWithOTP", { email });
  return successResponse({
    res,
    message: "user added successfully",
    data: { user },
    status: 201,
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("Authorization token is required", { cause: 401 }));
  }
  let decoded;
  decoded = verifyToken({
    token: authorization,
    signature: process.env.EMAIL_TOKEN_SIGNTURE,
  });
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email },
    { confirmEmail: true },
    { new: true }
  );
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return successResponse({
    res,
    message: "Email confirmed successfully",
    data: { user },
  });
});
export const VerifyEmailOTP = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Email not Exist", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return next(new Error("Already Confirmed", { cause: 409 }));
  }

  if (!compareHash({ plainText: `${code}`, hashValue: user.emailOTP })) {
    return next(new Error("in-valid OTP", { cause: 400 }));
  }
  await userModel.updateOne(
    { email },
    { confirmEmail: true, $unset: { emailOTP: 0 } }
  );

  return successResponse({
    res,
    status: 201,
    data: { user },
  });
});
