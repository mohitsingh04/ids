import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const userLocationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const UserLocation = mainDatabase.model("location", userLocationSchema);

export default UserLocation;
