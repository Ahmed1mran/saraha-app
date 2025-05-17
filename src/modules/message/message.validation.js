import joi from "joi";
import { generalFields } from "../../middleware/validation.midleware.js";

export const sendValidationMessage = joi.object().keys({
     message: joi.string().pattern(new RegExp(/^[a-zA-Z\u0600-\u06FF,-\s\d][\s\d\a-zA-Z\u0600-\u06FF,-]*$/)).min(2).max(50000).required(),
     recipientId:generalFields.id.required()

    })
  .required();
