import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";

export const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

export const fileExists = async (filePath) => {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const deleteFile = async (relativePath) => {
  try {
    const absolutePath = path.resolve(relativePath);

    const exists = await fileExists(absolutePath);
    if (!exists) {
      console.warn(`File not found, skipping delete: ${absolutePath}`);
      return false;
    }

    await fsPromises.unlink(absolutePath);
    console.log(`Deleted file: ${absolutePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete file: ${relativePath}`, error);
    return false;
  }
};
