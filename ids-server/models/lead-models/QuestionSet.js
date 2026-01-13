import mongoose from "mongoose";
import { mainDatabase } from "../../databases/Database.js";

const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    point: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length >= 2;
        },
        message: "Each question must have at least 2 options.",
      },
    },
  },
  { _id: false }
);

const questionSetSchema = new mongoose.Schema(
  {
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one question is required.",
      },
    },
  },
  { timestamps: true }
);

questionSetSchema.pre("save", function () {
  if (!Array.isArray(this.questions)) return;

  // Get existing ids
  const existingIds = this.questions
    .filter((q) => typeof q.id === "number")
    .map((q) => q.id);

  let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  // Assign id ONLY if missing
  this.questions.forEach((question) => {
    if (typeof question.id !== "number") {
      question.id = nextId;
      nextId++;
    }
  });
});

const QuestionSet = mainDatabase.model("QuestionSet", questionSetSchema);

export default QuestionSet;
