import * as registrationService from "./service/registration.service.js";
import { Router } from "express";
import * as validators from "./auth.validation.js";
import { forgerPassword, login, refreshToken, resetPassword } from "./service/login.service.js";
import { validation } from "../../middleware/validation.midleware.js";

const router = Router();

router.post(
  "/signup/Token",
  validation(validators.signup),
  registrationService.signupWithToken
);
router.post(
  "/signup/OTP",
  validation(validators.signup),
  registrationService.signupWithOTP
);
router.patch("/confirm-email", registrationService.confirmEmail);
router.patch("/VerifyEmailOTP", validation(validators.confirmEmailOTP), registrationService.VerifyEmailOTP);
router.post("/login", validation(validators.login), login);
router.get("/refresh-token", refreshToken);
router.patch("/forget-password",validation(validators.forgetPassword), forgerPassword);
router.patch("/reset-password",validation(validators.resetPassword), resetPassword);

export default router;
