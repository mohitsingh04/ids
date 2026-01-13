import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const QuestionSchema = new mongoose.Schema(
  {
    question_id: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
    },
    point: {
      type: Number,
    },
  },
  { _id: false }
);

const LeadConversationSchema = new mongoose.Schema(
  {
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: [(v) => v.length > 0, "Questions cannot be empty"],
    },
    rating: {
      type: Number,
    },
    status: {
      type: String,
      default: "open",
    },
    message: {
      type: String,
    },
    overallAnswerScore: { type: Number },
    submitQuestion: {
      type: {
        submitted: Number,
        total: Number,
      },
    },
    overallLeadScore: { type: Number },
  },
  { timestamps: true }
);

const LeadConversation = mainDatabase.model(
  "Lead-Conversation",
  LeadConversationSchema
);
export default LeadConversation;
