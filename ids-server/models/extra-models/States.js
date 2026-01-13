import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const StateSchema = new mongoose.Schema(
  {
    name: { type: String },
    country_code: { type: String },
    country_name: { type: String },
  },
  { timestamps: true }
);

const State = mainDatabase.model("State", StateSchema);

export default State;
