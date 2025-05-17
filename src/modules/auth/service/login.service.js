import userModel from "../../../DB/model/User.model.js";
import { userRoles } from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.js";
import { generateToken, verifyToken } from "../../../utils/security/token.js";
import { emailEvent } from "../../../utils/events/email.event.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In_Valid email or password", { cause: 409 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please confirm your email", { cause: 403 }));
  }
  if (!compareHash({ plainText: password, hashValue: user.password })) {
    return next(new Error("In_Valid email or password", { cause: 404 }));
  }
  user.deleted = false;
  await user.save();

  const accessToken = generateToken({
    payload: { id: user._id, isLoggedIn: true, name: user.userName },
    signature:
      user.role === userRoles.admin
        ? process.env.ADMIN_ACCESS_TOKEN
        : process.env.USER_ACCESS_TOKEN,
    options: { expiresIn: "1h" },
  });
  const refreshToken = generateToken({
    payload: { id: user._id },
    signature:
      user.role === userRoles.admin
        ? process.env.ADMIN_REFRESH_TOKEN
        : process.env.USER_REFRESH_TOKEN,
    options: { expiresIn: 31557600 },
  });
  return successResponse({
    res,
    message: " login successful",
    data: { Token: { accessToken, refreshToken } },
  });
});

  export const refreshToken = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(
        new Error("authorization is required or in-valid formate", { cause: 400 })
      );
    }
    const [bearer, token] = authorization?.split(" ") || [];
    if (!bearer || !token) {
      return next(
        new Error("authorization is required or in-valid formate", { cause: 400 })
      );
    }
    let signature = "";
    switch (bearer) {
      case "Admin":
        signature = process.env.ADMIN_REFRESH_TOKEN;
        break;
      case "User":
        signature = process.env.USER_REFRESH_TOKEN;
        break;
      default:
        break;
    }
    const decoded = verifyToken({ token, signature });
    if (!decoded?.id) {
      return next(new Error("In-valid token payload", { cause: 401 }));
    }
    const user = await userModel.findOne({ _id: decoded.id, deleted: false });
    if (!user) {
      return next(new Error("In-valid account", { cause: 404 }));
    }

    const accessToken = generateToken({
      payload: { id: user._id, isLoggedIn: true, name: user.userName },
      signature:
        user.role === userRoles.admin
          ? process.env.ADMIN_ACCESS_TOKEN
          : process.env.USER_ACCESS_TOKEN,
      options: { expiresIn: "1h" },
    });
    const refreshToken = generateToken({
      payload: { id: user._id },
      signature:
        user.role === userRoles.admin
          ? process.env.ADMIN_REFRESH_TOKEN
          : process.env.USER_REFRESH_TOKEN,
      options: { expiresIn: 31557600 },
    });

    return successResponse({
      res,
      message: " login successful",
      data: { Token: { accessToken, refreshToken } },
    });
  });

export const forgerPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email, deleted: false });
  if (!user) {
    return next(new Error("In-valid account", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("Please Confirm Your Email First", { cause: 400 }));
  }

  emailEvent.emit("sendForgetPassword", { email });

  return successResponse({
    res,
    message: " check your account To create new password",
  });
});
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password , confirmEmail} = req.body;
  const user = await userModel.findOne({ email, deleted: false });
  if (!user) {
    return next(new Error("In-valid account", { cause: 404 }));
  }
  if (!compareHash({ plainText: code, hashValue: user.forgetPasswordOTP })) {
    return next(new Error("in-valid reset code", { cause: 400 }));
  }
  const hashPassword = generateHash({ plainText: password });
  await userModel.updateOne(
    { email },
    {
      password: hashPassword,
      confirmEmail: true,
      changePasswordTime: Date.now(),
      $unset: { forgetPasswordOTP: null },
    }
  );
  emailEvent.emit("sendForgetPassword", { email });

  return successResponse({
    res,
    message: " your Password Updated Successfully",
  });
});
