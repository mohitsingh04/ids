import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_VALUE = process.env.JWT_SECRET_VALUE;

export const normalizePhone = (num) => {
  if (!num) return null;
  let cleaned = num.toString().trim().replace(/\s+/g, "");
  cleaned = cleaned.replace(/^\++/, "+");
  if (!cleaned.startsWith("+")) {
    cleaned = `+${cleaned}`;
  }

  return cleaned;
};

export const DecodeJwtToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_VALUE);
    return decodedToken;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { expired: true };
    }
    throw error;
  }
};

export const createJwtToken = (data, expiry = "5y") => {
  const accessToken = jwt.sign(data, JWT_SECRET_VALUE, { expiresIn: expiry });
  return accessToken;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getUploadedFilePaths = (req, fieldName) => {
  try {
    if (!req.files || !req.files[fieldName]) return [];

    const paths = req.files[fieldName].flatMap((file) => {
      const webp = file.webpFilename || null;
      const original = file.originalFilename || null;
      return [webp, original].filter(Boolean);
    });

    return paths;
  } catch (error) {
    console.error("Error extracting file paths:", error);
    return [];
  }
};
