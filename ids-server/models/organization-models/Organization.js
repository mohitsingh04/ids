import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const organizationSchema = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    organization_name: {
      type: String,
      required: true,
    },
    members: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Organization = mainDatabase.model("organization", organizationSchema);

export default Organization;
