import path from "node:path";

import MailTransporter from "../utils/MailTransporter.js";
import RegularUser from "../models/user-models/RegularUser.js";
import ejs from "ejs";
import { createJwtToken } from "../utils/Callbacks.js";

const YP_EMAIL = process.env.EMAIL;

export const sendUserEmailVerification = async ({ userId, email }) => {
  try {
    const token = await createJwtToken({ userId }, "5m");

    const saveVerifyToken = await RegularUser.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { new: true }
    );

    if (!saveVerifyToken) {
      return { message: "User not found." };
    }

    const origin = process.env.IDS_APP_URL;
    if (!origin) throw new Error("Origin not found");

    const verificationUrl = `${origin}/auth/verify-email/confirm/${token}`;

    const templatePath = path.resolve("templates", "EmailVerification.ejs");

    const html = await ejs.renderFile(templatePath, {
      verificationUrl,
      user: saveVerifyToken,
    });

    const mailOptions = {
      from: YP_EMAIL,
      to: email,
      subject: "Account Verification",
      html,
    };

    await MailTransporter.sendMail(mailOptions);

    return { message: "Verification email sent. Check your inbox." };
  } catch (error) {
    console.error("Error in sendEmailVerification:", error);
    throw error;
  }
};

export const sendUserResetEmail = async (user) => {
  try {
    const token = await createJwtToken({ email: user.email }, "5m");

    const userInfo = await RegularUser.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { new: true }
    );

    const origin = process.env.IDS_APP_URL;
    if (!origin) throw new Error("Origin not found");

    const resetUrl = `${origin}/auth/reset-password/confirm/${token}`;

    const templatePath = path.resolve("templates", "ResetPassword.ejs");

    const html = await ejs.renderFile(templatePath, {
      resetUrl,
      user: userInfo,
    });

    const mailOptions = {
      from: YP_EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: html,
    };

    await MailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending password reset email:", error);
  }
};

export const sendUserCreatedSetPasswordEmail = async (user) => {
  try {
    const token = await createJwtToken({ email: user.email });

    const userInfo = await RegularUser.findOneAndUpdate(
      { _id: user._id },
      { $set: { setPasswordToken: token } },
      { new: true }
    );

    const origin = process.env.IDS_APP_URL;
    if (!origin) throw new Error("Origin not found");

    const setpasswordUrl = `${origin}/auth/set-password/confirm/${token}`;

    const templatePath = path.resolve("templates", "SetPassword.ejs");

    const html = await ejs.renderFile(templatePath, {
      setpasswordUrl,
      user: userInfo,
    });

    const mailOptions = {
      from: YP_EMAIL,
      to: user.email,
      subject: "Set Your Yogprerna Account Password",
      html: html,
    };

    await MailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending create user email:", error);
  }
};
