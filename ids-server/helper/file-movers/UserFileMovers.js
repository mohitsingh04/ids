import path from "node:path";
import { fileURLToPath } from "node:url";
import RegularUser from "../../models/user-models/RegularUser.js";
import { ensureDir, fileExists } from "../../utils/FileOperations.js";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEDIA_FOLDER_PATH = process.env.BASE_MEDIA_FOLDER_PATH;
const baseFilePath = "../../media/images";

export const UserMainImageMover = async (req, res, userId, fieldName) => {
  try {
    const oldDir = path.join(__dirname, baseFilePath);
    const newDir = path.join(
      __dirname,
      `${MEDIA_FOLDER_PATH}/profile/${userId}/main`
    );
    await ensureDir(newDir);

    const user = await RegularUser.findOne({ _id: userId });
    if (!user) {
      console.warn(`User not found for ID: ${userId}`);
      return;
    }

    if (!["avatar", "banner"].includes(fieldName)) {
      console.warn(`Invalid field name: ${fieldName}`);
      return;
    }

    const imageArray = user[fieldName];
    if (!Array.isArray(imageArray) || imageArray.length === 0) {
      console.warn(`No images found in field: ${fieldName}`);
      return;
    }

    const updatedImagePaths = [];
    const skippedFiles = [];

    for (const imgPath of imageArray) {
      const imgName = imgPath.split(/\\|\//).pop();
      if (imgPath.startsWith(`${userId}/main/`)) {
        updatedImagePaths.push(imgPath);
        continue;
      }

      const oldPath = path.join(oldDir, imgName);
      const newPath = path.join(newDir, imgName);

      if (await fileExists(oldPath)) {
        try {
          await fs.rename(oldPath, newPath);
          updatedImagePaths.push(`/profile/${userId}/main/${imgName}`);
        } catch (err) {
          console.warn(`Failed to move ${imgName}: ${err.message}`);
          skippedFiles.push(imgName);
        }
      } else {
        console.warn(`File not found: ${oldPath}`);
        skippedFiles.push(imgName);
      }
    }

    if (updatedImagePaths.length > 0) {
      user[fieldName] = updatedImagePaths;
      await user.save();
      console.log(`${fieldName} images for user ${userId} updated.`);

      if (skippedFiles.length > 0) {
        console.warn(`Some files were skipped: ${skippedFiles.join(", ")}`);
      }
    } else {
      console.warn(`No files were moved. Nothing saved for ${fieldName}`);
    }
  } catch (error) {
    console.error("Error in MainImageMover:", error);
  }
};
