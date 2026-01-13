import path from "node:path";

import multer from "multer";
import { generateSlug } from "./Callbacks.js";
import { ensureDir } from "./FileOperations.js";

const createStorage = (destination, prefix = "img") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDir(destination);
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const parsed = path.parse(file.originalname);
      const sluggedName = generateSlug(parsed.name);
      cb(null, `${prefix}-${Date.now()}-${sluggedName}${parsed.ext}`);
    },
  });

export const upload = multer({ storage: createStorage("./media/images") });
