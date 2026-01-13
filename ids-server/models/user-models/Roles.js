import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

 const UserRoles = mainDatabase.model("role", roleSchema);

export default UserRoles