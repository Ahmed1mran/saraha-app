import { userRoles } from "../../middleware/auth.middleware.js";

export const endpoint = {
  profile: Object.values(userRoles),
};
