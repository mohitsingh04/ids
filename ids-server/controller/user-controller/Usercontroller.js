import { sendUserCreatedSetPasswordEmail } from "../../email/UserEmails.js";
import { UserMainImageMover } from "../../helper/file-movers/UserFileMovers.js";
import UserPermissions from "../../models/user-models/Permissions.js";
import RegularUser from "../../models/user-models/RegularUser.js";
import UserRoles from "../../models/user-models/Roles.js";
import UserLocation from "../../models/user-models/UserLocation.js";
import {
  DecodeJwtToken,
  getUploadedFilePaths,
  normalizePhone,
} from "../../utils/Callbacks.js";
import { deleteFile } from "../../utils/FileOperations.js";
import { getDataFromToken } from "../../utils/GetDatafromToken.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await RegularUser.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUsersByOrganizationId = async (req, res) => {
  try {
    const { organization_id } = req.params;
    const users = await RegularUser.find({ organization_id });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await RegularUser.findById(userId);

    const location = await UserLocation.findOne({ userId });

    const user = userDoc?.toObject();

    const finalData = location
      ? {
          ...user,
          address: location.address,
          pincode: location.pincode,
          city: location.city,
          state: location.state,
          country: location.country,
        }
      : user;

    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserAvatarChange = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileImage = await getUploadedFilePaths(req, "avatar");

    if (!profileImage || profileImage?.length <= 0)
      return res.status(400).json({ error: "No image uploaded" });

    const user = await RegularUser.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await RegularUser.findOneAndUpdate(
      { _id: userId },
      { avatar: profileImage }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    if (updatedUser)
      await UserMainImageMover(req, res, updatedUser._id, "avatar");

    return res
      .status(200)
      .json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteProfileAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "UserId is required" });

    const user = await RegularUser.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await RegularUser.findOneAndUpdate(
      { _id: userId },
      { $unset: { avatar: "" } }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    if (updatedUser)
      user?.avatar.map(async (item) => await deleteFile(`../media/${item}`));

    return res
      .status(200)
      .json({ message: "Profile avatar deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    let { name, email, mobile_no, alt_mobile_no } = req.body;

    const user = await RegularUser.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const normalizedMobile = normalizePhone(mobile_no || user.mobile_no);
    const normalizedAltMobile = normalizePhone(
      alt_mobile_no || user.alt_mobile_no
    );

    if (normalizedAltMobile) {
      if (normalizedAltMobile === normalizedMobile) {
        return res.status(400).json({
          error: "Mobile No. and Alt Mobile No. cannot be the same.",
        });
      }
    }

    if (email && (await RegularUser.findOne({ email, _id: { $ne: userId } })))
      return res
        .status(400)
        .json({ error: "Email is already in use by another user." });

    if (
      mobile_no &&
      (await RegularUser.findOne({
        mobile_no: normalizedMobile,
        _id: { $ne: userId },
      }))
    )
      return res
        .status(400)
        .json({ error: "Mobile number is already in use by another user." });

    if (
      await RegularUser.findOne({
        _id: { $ne: userId },
        $or: [
          { mobile_no: normalizedAltMobile },
          { alt_mobile_no: normalizedAltMobile },
        ],
      })
    ) {
      return res.status(400).json({
        error: "Alternate mobile number is already in use.",
      });
    }

    const updatedFields = {
      name: name || user.name,
      email: email || user.email,
      mobile_no: normalizedMobile,
      alt_mobile_no: normalizedAltMobile,
    };

    await RegularUser.findByIdAndUpdate(userId, { $set: updatedFields });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateUserLocation = async (req, res) => {
  try {
    const { userId, address, pincode, city, state, country } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required." });

    const updatedLocation = await UserLocation.findOneAndUpdate(
      { userId },
      { $set: { address, pincode, city, state, country } },
      { new: true, upsert: true }
    );

    if (!updatedLocation)
      return res
        .status(400)
        .json({ error: "Something Went Wrong. Please Try Again Later" });

    return res
      .status(200)
      .json({ message: "Profile location saved successfully." });
  } catch (error) {
    console.error("Error saving profile location:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const CreateNewUser = async (req, res) => {
  try {
    const { name, email, mobile_no, organization_id } = req.body;
    const role = "caller";

    if (!name || !email || !mobile_no)
      return res.status(400).json({ error: "Required Field is Missing." });

    const normalizedMobile = normalizePhone(mobile_no);

    const isExistingEmail = await RegularUser.findOne({ email });
    if (isExistingEmail)
      return res.status(400).json({ error: "Already Existing Email" });

    const isExistingMobile = await RegularUser.findOne({
      mobile_no: normalizedMobile,
    });
    if (isExistingMobile)
      return res.status(400).json({ error: "Already Existing Mobile Number" });

    let roleDoc = await UserRoles.findOne({ role });
    if (!roleDoc)
      return res.status(400).json({ error: "Invalid Role Provided" });

    let permissions = [];
    const PropertyPermissions = await UserPermissions.findOne({
      roles: roleDoc?._id,
    });
    if (PropertyPermissions) {
      permissions = PropertyPermissions.permissions.map((item) => item._id);
    }

    const newUser = new RegularUser({
      adminId: authUserId,
      name,
      email,
      mobile_no: normalizedMobile,
      role: roleDoc?._id || null,
      permissions,
      organization_id,
    });

    const finalUser = await newUser.save();

    if (finalUser) await sendUserCreatedSetPasswordEmail(finalUser);

    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetUserSetTokenForCreation = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ error: "Token is required." });

    const decodedToken = DecodeJwtToken(token);
    if (decodedToken?.expired)
      return res
        .status(401)
        .json({ error: "Reset link has expired. Try again." });

    const email = decodedToken?.email;

    const user = await RegularUser.findOne({
      setPasswordToken: token,
      email: email,
    });
    if (!user)
      return res.status(404).json({ error: "Invalid or expired token." });

    return res.status(200).json({ message: "Valid token", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserPostSetTokenPassword = async (req, res) => {
  try {
    const { new_password, confirm_password, token } = req.body;

    if (!new_password || !confirm_password || !token)
      return res.status(400).json({ error: "All fields are required." });

    if (new_password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match." });

    const decodedToken = DecodeJwtToken(token);
    console.log(decodedToken);
    if (decodedToken?.expired)
      return res
        .status(401)
        .json({ error: "Reset link has expired. Try again." });

    const email = decodedToken?.email;

    const tokenUser = await RegularUser.findOne({
      setPasswordToken: token,
      email,
    }).select("+password");

    if (!tokenUser) return res.status(404).json({ error: "Invalid token." });

    if (tokenUser.resetTokenExpiry < Date.now())
      return res.status(400).json({ error: "Reset token expired." });

    tokenUser.password = new_password;
    tokenUser.verified = true;
    tokenUser.setPasswordToken = undefined;
    tokenUser.resetToken = undefined;
    tokenUser.resetTokenExpiry = undefined;

    await tokenUser.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateUserDetailsByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "User ID is required." });

    const { name, email, mobile_no, alt_mobile_no, role, status, verified } =
      req.body;

    const user = await RegularUser.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const normalizedMobile = normalizePhone(mobile_no || user.mobile_no);
    const normalizedAltMobile = normalizePhone(
      alt_mobile_no || user.alt_mobile_no
    );

    if (normalizedAltMobile && normalizedAltMobile === normalizedMobile)
      return res
        .status(400)
        .json({ error: "Mobile No. and Alt Mobile No. cannot be the same." });

    if (email && (await RegularUser.findOne({ email, _id: { $ne: userId } })))
      return res
        .status(400)
        .json({ error: "Email is already in use by another user." });

    if (
      mobile_no &&
      (await RegularUser.findOne({
        mobile_no: normalizedMobile,
        _id: { $ne: userId },
      }))
    )
      return res
        .status(400)
        .json({ error: "Mobile number is already in use by another user." });

    if (
      normalizedAltMobile &&
      (await RegularUser.findOne({
        _id: { $ne: userId },
        $or: [
          { mobile_no: normalizedAltMobile },
          { alt_mobile_no: normalizedAltMobile },
        ],
      }))
    )
      return res
        .status(400)
        .json({ error: "Alternate mobile number is already in use." });

    const updatedFields = {
      name: name || user.name,
      email: email || user.email,
      mobile_no: normalizedMobile,
      alt_mobile_no: normalizedAltMobile,
      status,
      verified,
    };

    if (role) {
      updatedFields.role = role;
      const allPermissions = await UserPermissions.find();
      const matchedPermissions = allPermissions.filter((perm) =>
        perm.roles.some((r) => r.equals(role))
      );

      const permissionIds = matchedPermissions.flatMap((p) =>
        p.permissions.map((perm) => perm._id)
      );

      updatedFields.permissions = permissionIds;
    }

    await RegularUser.findByIdAndUpdate(userId, { $set: updatedFields });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
