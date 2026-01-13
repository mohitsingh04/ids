import sharp from "sharp";
import path from "node:path";
import { generateSlug } from "./Callbacks.js";

export const processImage = async (req, res, next) => {
  const files = req.files;
  if (!files) return next();

  try {
    for (const field in files) {
      for (const file of files[field]) {
        const inputPath = file.path;
        const destinationFolder = path.dirname(inputPath);

        const parsed = path.parse(file.filename);
        const sluggedName = generateSlug(parsed.name);
        const outputFilename = `${sluggedName}-compressed.webp`;
        const outputPath = path.join(destinationFolder, outputFilename);

        await sharp(inputPath).webp({ quality: 40 }).toFile(outputPath);

        file.originalFilename = file.filename;
        file.originalPath = inputPath;
        file.webpFilename = outputFilename;
        file.webpPath = outputPath;
      }
    }
    next();
  } catch (error) {
    console.error("Image processing error:", error);
    return res.status(500).json({ error: "Image processing failed" });
  }
};
