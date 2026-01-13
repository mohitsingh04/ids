import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const StatusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true,
    },
    parent_status: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Status = mainDatabase.model("Status", StatusSchema);

export default Status;
