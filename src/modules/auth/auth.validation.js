import joi from 'joi'
import { generalFields } from "../../middleware/validation.midleware.js";

export const signup = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),

    email: generalFields.email.required(),

    password: generalFields.password.required(),

    confirmPassword: generalFields.confirmPassword
      .valid(joi.ref("password"))
      .required(),

    phone: generalFields.phone.required(),
    "accept-language": generalFields.acceptLanguage,
  })
  .required();

export const login = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  })
  .options({ allowUnknown: false })
  .required();

export const confirmEmailOTP = joi.object().keys({
  email: generalFields.email.required(),
  code: joi.string().pattern(new RegExp(/^\d{4}$/)).required(),
}).required();


export const forgetPassword = joi.object().keys({
  email: generalFields.email.required(),
}).required();
export const resetPassword = joi.object().keys({
  email: generalFields.email.required(),
  code: generalFields.code.required(),
password:generalFields.password.required(),
confirmPassword:generalFields.confirmPassword.valid(joi.ref('password')).required()
}).required();
