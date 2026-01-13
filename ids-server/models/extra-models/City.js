import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const CitySchema = new mongoose.Schema(
  {
    name: { type: String },
    state_code: { type: String },
    state_name: { type: String },
    country_code: { type: String },
    country_name: { type: String },
  },
  { timestamps: true }
);

const City = mainDatabase.model("City", CitySchema);

export default City;
