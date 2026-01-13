import { DecodeJwtToken } from "./Callbacks.js";
import RegularUser from "../models/user-models/RegularUser.js";

export const getToken = async (req) => {
  try {
    const token = req.cookies?.accessToken;
    return token;
  } catch (error) {
    console.log("Error on getDataFromToken", error.message);
    return null;
  }
};

export const getDataFromToken = async (req) => {
  try {
    const token = await getToken(req);
    if (!token) throw new Error("Token not found");

    const decodedToken = DecodeJwtToken(token);
    return decodedToken.id;
  } catch (error) {
    console.log("Error on getDataFromToken", error.message);
    return null;
  }
};

export const getUserDataFromToken = async (req) => {
  try {
    const token = await getToken(req);
    if (!token) throw new Error("Token not found");

    const decodedToken = DecodeJwtToken(token);
    const user = await RegularUser.findById(decodedToken.id);
    return user;
  } catch (error) {
    console.log("Error on getDataFromToken", error.message);
    return null;
  }
};

export const removeToken = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
};
