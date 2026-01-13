import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const CountrySchema = new mongoose.Schema(
  { country_name: { type: String } },
  { timestamps: true }
);

const Country = mainDatabase.model("Country", CountrySchema);

export default Country;
