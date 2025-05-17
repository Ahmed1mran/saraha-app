import joi from "joi";
import { generalFields } from "../../middleware/validation.midleware.js";

export const updateProfile = joi
  .object()
  .keys({
    userName: generalFields.userName,
    phone: generalFields.phone,
    gender: generalFields.gender,
    DOB: joi.date().less("now"),
  })
  .required();

export const updatepassword = joi.object().keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(joi.ref("oldPassword ")).required(),
    confirmationPassword: generalFields.confirmPassword
      .valid(joi.ref("password"))
      .required(),
    DOB: joi.date().less("now"),
  }).required();
export const shareProfile = joi
  .object()
  .keys({
    userId: generalFields.id.required(),
  })
  .required();
