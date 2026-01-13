import express from "express";
import {
  AuthUserDetails,
  changeUserPassword,
  GetEmailVerification,
  GetUserResetToken,
  Login,
  Register,
  UserForgotPassword,
  UserLogout,
  UserPostResetToken,
  VerifyUserEmail,
} from "../controller/auth-controller/AuthController.js";
import {
  createPermissions,
  getAllPermissions,
  getAllRoles,
  updateUserPermissions,
} from "../controller/auth-controller/RolesAndPermissions.js";

const authRouter = express.Router();
authRouter.use(express.json());
authRouter.use(express.urlencoded({ extended: true }));

authRouter.post("/auth/register", Register);
authRouter.get("/auth/verify-email/email/:email", VerifyUserEmail);
authRouter.get("/auth/verify-email/:token", GetEmailVerification);
authRouter.post("/auth/login", Login);
authRouter.get("/auth/detail", AuthUserDetails);
authRouter.get("/auth/logout", UserLogout);
authRouter.post("/auth/forgot-password", UserForgotPassword);
authRouter.post("/auth/reset-password", UserPostResetToken);
authRouter.get("/auth/reset/:token", GetUserResetToken);
authRouter.post("/auth/change-password", changeUserPassword);

authRouter.get("/user/permissions", getAllPermissions);
authRouter.get("/user/roles", getAllRoles);
authRouter.post("/user/permissions", createPermissions);
authRouter.patch(`/user/:objectId/permissions`, updateUserPermissions);

export default authRouter;
