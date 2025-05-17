import joi from "joi";
import { genderTypes } from "../DB/model/User.model.js";
import { Types } from "mongoose";

export const validationObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};
export const generalFields = {
  userName: joi.string().min(2).max(25),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.email": "please enter valid email format like example@gmail.com",
      "string.empty": "email cannot be empty",
      "any.required": "email is required",
    }),
  password: joi
    .string()
    .pattern(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .messages({ "string.pattern.base": "please enter strong password" }),
  confirmPassword: joi.string(),
  code:joi.string().pattern(new RegExp(/^\d{4}$/)),
  phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  acceptLanguage: joi.string().valid("en", "ar").default("en"),
  gender: joi.string().valid(genderTypes.male, genderTypes.female),
  id: joi.string().custom(validationObjectId),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = { ...req.body, ...req.query, ...req.params };

    if (req.headers["accept-language"]) {
      inputData["accept-language"] = req.headers["accept-language"];
    }
    const validationError = schema.validate(inputData, { abortEarly: false });
    if (validationError.error) {
      return res.status(400).json({
        message: "validation result",
        validationError: validationError.error.details,
      });
    }

    return next();
  };
};
