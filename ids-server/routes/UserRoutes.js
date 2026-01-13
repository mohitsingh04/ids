import express from "express";
import { processImage } from "../utils/ProcessImage.js";
import {
  CreateNewUser,
  DeleteProfileAvatar,
  getAllUsers,
  getUserByUserId,
  getUsersByOrganizationId,
  GetUserSetTokenForCreation,
  UpdateUserDetails,
  UpdateUserDetailsByAdmin,
  UpdateUserLocation,
  UserAvatarChange,
  UserPostSetTokenPassword,
} from "../controller/user-controller/Usercontroller.js";
import { upload } from "../utils/Mutler.js";

const userRoutes = express.Router();
userRoutes.use(express.json());
userRoutes.use(express.urlencoded({ extended: true }));

const avatarUpload = upload.fields([{ name: "avatar", maxCount: 1 }]);
userRoutes.patch(
  `/user/avatar/:userId`,
  avatarUpload,
  processImage,
  UserAvatarChange
);
userRoutes.delete(`/user/avatar/:userId`, DeleteProfileAvatar);
userRoutes.patch(`/user/:userId`, UpdateUserDetails);
userRoutes.patch(`/user/:userId/update`, UpdateUserDetailsByAdmin);
userRoutes.patch(`/user/update/location`, UpdateUserLocation);
userRoutes.post(`/user/create`, CreateNewUser);
userRoutes.get(`/users`, getAllUsers);
userRoutes.get(`/user/:userId`, getUserByUserId);
userRoutes.get(`/user/organization/:organization_id`, getUsersByOrganizationId);
userRoutes.get(`/user/create/set-password/:token`, GetUserSetTokenForCreation);
userRoutes.post(`/user/create/set-password`, UserPostSetTokenPassword);

export default userRoutes;
