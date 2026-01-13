import RegularUser from "../../models/user-models/RegularUser.js";
import UserPermissions from "../../models/user-models/Permissions.js";
import UserRoles from "../../models/user-models/Roles.js";

import {
  sendUserEmailVerification,
  sendUserResetEmail,
} from "../../email/UserEmails.js";
import {
  createJwtToken,
  DecodeJwtToken,
  normalizePhone,
} from "../../utils/Callbacks.js";
import {
  getUserDataFromToken,
  removeToken,
} from "../../utils/GetDatafromToken.js";
import UserLocation from "../../models/user-models/UserLocation.js";

export const Register = async (req, res) => {
  try {
    let { name, email, mobile_no, password, confirm_password } = req.body;
    const role = "admin";

    if (!name || !email || !mobile_no || !password || !confirm_password)
      return res.status(400).json({ error: "Required Field is Missing." });

    if (password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match." });

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
      name,
      email,
      mobile_no: normalizedMobile,
      password,
      role: roleDoc?._id || null,
      permissions,
    });

    const finalUser = await newUser.save();

    await sendUserEmailVerification({ userId: finalUser?._id, email });

    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetEmailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ error: "Token is required." });

    const user = await RegularUser.findOne({ verifyToken: token });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token." });

    if (!user.verifyTokenExpiry || user.verifyTokenExpiry < new Date()) {
      await sendUserEmailVerification({
        userId: user?._id,
        email: user?.email,
      });
      return res.status(400).json({ error: "Token has expired." });
    }

    const verifiedUser = await RegularUser.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { verified: true },
        $unset: { verifyToken: "", verifyTokenExpiry: "" },
      },
      { new: true }
    );

    if (!verifiedUser)
      return res.status(500).json({ error: "Failed to verify email." });

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const VerifyUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await RegularUser.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ error: "User not found. Please check your email." });

    if (user.verified)
      return res.status(400).json({ error: "You are already Verified." });

    await sendUserEmailVerification({ userId: user?._id, email });

    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await RegularUser.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User does not exist!" });

    if (user.status === "Suspended") {
      return res
        .status(400)
        .json({ error: "Sorry Your Are Blocked. Please Support." });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
      return res.status(401).json({ error: "Incorrect password!" });

    if (!user?.verified) {
      await sendUserEmailVerification({ userId: user._id, email });
      return res.status(403).json({
        error: "Email not verified. Verification email sent.",
        flag: "UnVerified",
      });
    }

    const accessToken = await createJwtToken({ id: user._id, email });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60 * 1000 * 365,
    });

    return res.status(200).json({ message: "Logged in successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AuthUserDetails = async (req, res) => {
  try {
    const userDoc = await getUserDataFromToken(req);

    if (!userDoc) {
      await removeToken(res);
      return res.status(404).json({ error: "User not found" });
    }
    if (userDoc.status === "Suspended" || !userDoc?.verified) {
      await removeToken(res);
      return res.status(404).json({ error: "Sorry You Are Blocked" });
    }

    const user = userDoc.toObject();

    const location = await UserLocation.findOne({ userId: user?._id });

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

export const UserLogout = async (req, res) => {
  try {
    await removeToken(res);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await RegularUser.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    await sendUserResetEmail(user);

    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetUserResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ error: "Token is required." });

    const decodedToken = DecodeJwtToken(token);

    if (decodedToken?.expired)
      return res
        .status(401)
        .json({ error: "Reset link has expired. Try again." });

    const email = decodedToken?.email;

    const user = await RegularUser.findOne({ resetToken: token, email: email });
    if (!user)
      return res.status(404).json({ error: "Invalid or expired token." });

    return res.status(200).json({ message: "Valid token", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const UserPostResetToken = async (req, res) => {
  try {
    const { new_password, confirm_password, token } = req.body;

    if (!new_password || !confirm_password || !token)
      return res.status(400).json({ error: "All fields are required." });

    if (new_password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match." });

    const decodedToken = DecodeJwtToken(token);

    if (decodedToken?.expired)
      return res
        .status(401)
        .json({ error: "Reset link has expired. Try again." });

    const email = decodedToken?.email;

    const tokenUser = await RegularUser.findOne({
      resetToken: token,
      email,
    }).select("+password");

    if (!tokenUser) return res.status(404).json({ error: "Invalid token." });

    if (tokenUser.resetTokenExpiry < Date.now())
      return res.status(400).json({ error: "Reset token expired." });

    tokenUser.password = new_password;
    tokenUser.resetToken = undefined;
    tokenUser.resetTokenExpiry = undefined;

    await tokenUser.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { id, current_password, new_password, confirm_password } = req.body;

    if (!id || !current_password || !new_password || !confirm_password)
      return res.status(400).json({ error: "All fields are required" });

    const user = await RegularUser.findById(id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (new_password !== confirm_password)
      return res
        .status(400)
        .json({ error: "New password and confirm password must match" });

    const isPasswordMatch = await user.comparePassword(current_password);
    if (!isPasswordMatch)
      return res.status(401).json({ error: "Incorrect password!" });

    user.password = new_password;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
