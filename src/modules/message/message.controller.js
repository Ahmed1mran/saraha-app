import { Router } from "express";
import { sendMessage } from "./message.service.js";
import { sendValidationMessage } from "./message.validation.js";
import { validation } from "../../middleware/validation.midleware.js";
const router = Router();

router.post("/", validation(sendValidationMessage), sendMessage);
export default router;
