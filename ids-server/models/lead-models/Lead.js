import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const leadSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    mobile_no: String,
    message: String,
    status: {
      type: String,
      default: "Pending",
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Lead = mainDatabase.model("Lead", leadSchema);
export default Lead;
