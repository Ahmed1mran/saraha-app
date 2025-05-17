import userModel from "../DB/model/User.model.js";
import { asyncHandler } from "../utils/error/error.js";
import { verifyToken } from "../utils/security/token.js";

export const userRoles = {
  user: "User",
  admin: "Admin",
};

export const authentication = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    const [bearer, token] = authorization?.split(" ") || [];
    if (!bearer || !token) {
      return next(new Error("in-Valid token parts", { cause: 400 }));
    }
    let signature = undefined;
    switch (bearer) {
      case "Admin":
        signature = process.env.TOKEN_SIGNTURE_ADMIN;
        break;
      case "Bearer":
        signature = process.env.TOKEN_SIGNTURE;
        break;

      default:
        break;
    }
    const decoded = verifyToken({ token, signature });

    if (!decoded?.id) {
      return next(new Error("In_valid token payload", { cause: 400 }));
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new Error("not register account", { cause: 404 }));
    }
    if (
      parseInt((user.changePasswordTime?.getTime() || 0) / 1000) >= decoded.iat
    ) {
      return next(new Error("Expired credential ", { cause: 400 }));
    }

    req.user = user;
    return next();
  });
};
export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("un authorized account", { cause: 403 }));
    }
    return next();
  });
};
