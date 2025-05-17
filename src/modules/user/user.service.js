import { messageModel } from "../../DB/model/message.mode.js";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../../utils/error/error.js";
import { successResponse } from "../../utils/response/success.response.js";
import {
  decodeEncryption,
  generateEncryption,
} from "../../utils/security/encryption.js";
import { compareHash, generateHash } from "../../utils/security/hash.js";

export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.params.userId)
    .select("userName image gende DOB ");
  return user
    ? successResponse({ res, data: { user } })
    : next(new Error("In-valid account Id", { cause: 404 }));
});
export const profile = asyncHandler(async (req, res, next) => {
  req.user.phone = decodeEncryption({ cipherText: req.user.phone });
  const messages = await messageModel
    .find({ recipientId: req.user._id })
    .populate({
      path: "recipientId",
      select: "-password",
    });
  return successResponse({ res, data: { user: req.user, messages } });
});
export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = generateEncryption({ plainText: req.user.phone });
  }
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  return successResponse({ res, data: { user } });
});

export const updatepassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  if (!compareHash({ plainText: oldPassword, hashValue: req.user.password })) {
    return next(new Error("In-valid user password ", { cause: 400 }));
  }
  const hashPassword = generateHash({ plainText: password });
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { password: hashPassword, changePasswordTime: Date.now() },
    { new: true }
  );

  return successResponse({ res, data: { user } });
});
export const freezeAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { deleted: true, changePasswordTime: Date.now() },
    { new: true }
  );

    return successResponse({ res, data: { user } });
  });
