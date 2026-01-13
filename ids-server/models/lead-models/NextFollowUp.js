import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const nextfollowupSchema = mongoose.Schema(
  {
    next_follow_up_date: {
      type: Date,
      required: true,
    },
    next_follow_up_time: { type: String },
  },
  { timestamps: true }
);

const NextFollowUp = mainDatabase.model("next-follow-up", nextfollowupSchema);

export default NextFollowUp;
