import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const permissionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "roles",
      required: true,
    },
    permissions: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

 const UserPermissions = mainDatabase.model(
  "permissions",
  permissionsSchema
);
export default UserPermissions