import { Router } from "express";
import {
  freezeAccount,
  profile,
  shareProfile,
  updateProfile,
  updatepassword,
} from "./user.service.js";
import {
  userRoles,
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";
import * as validators from "./user.validation.js";
import { validation } from "../../middleware/validation.midleware.js";
const router = Router();

router.get(
  "/profile",
  authentication(),
  authorization(endpoint.profile),
  profile
);
router.patch(
  "/profile",
  validation(validators.updateProfile),
  authentication(),
  authorization(endpoint.profile),
  updateProfile
);
router.patch(
  "/profile/password",
  validation(validators.updatepassword),
  authentication(),
  authorization(endpoint.profile),
  updatepassword
);
router.delete(
  "/profile",
  authentication(),
  authorization(endpoint.profile),
  freezeAccount
);
router.get(
  "/:userId/profile",
  validation(validators.shareProfile),
  shareProfile
);
export default router;
