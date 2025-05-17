import { messageModel } from "../../DB/model/message.mode.js";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../../utils/error/error.js";
import { successResponse } from "../../utils/response/success.response.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { message, recipientId } = req.body;
  const user = await userModel.findById({ _id: recipientId, decoded: false });
  if (!user) {
    return next(new Error("In-valid recipient", { cause: 404 }));
  }
  const newMessage = await messageModel.create({ message, recipientId });
  return successResponse({ res, message: "Done", status: 201 });
});
