import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { userRoles } from "../../middleware/auth.middleware.js";

export const genderTypes = {
  male: " male",
  female: "female",
};
export const roleTypes = {
  user: " user",
  admin: "admin",
};

const userSchema = new Schema(
  {
    userName: { type: String, require: true },
    email: { type: String, unique: [true, "email Exist"], require: true },
    password: { type: String, require: true },
    phone: { type: String, require: true },
    confirmEmail: { type: Boolean, default: false },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    forgetPasswordOTP: String,
    DOB: Date,
    emailOTP: String,
    age: {
      type: Number,
      min: [18, "min age is 18"],
      max: [60, "max age is 60"],
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.user,
    },
    changePasswordTime: Date,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
