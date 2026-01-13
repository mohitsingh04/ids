import mongoose from "mongoose";
import QuestionSet from "../../models/lead-models/QuestionSet.js";

export const upsertQuestionSet = async (req, res) => {
  try {
    const { organization_id, questions } = req.body;

    /* ---------- BASIC VALIDATION ---------- */
    if (!organization_id) {
      return res.status(400).json({
        error: "organization_id is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(organization_id)) {
      return res.status(400).json({
        error: "Invalid organization_id.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        error: "At least one question is required.",
      });
    }

    /* ---------- VALIDATE QUESTIONS ---------- */
    for (const q of questions) {
      if (!q.title || !q.questionText) {
        return res.status(400).json({
          error: "Each question must have title and questionText.",
        });
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          error: "Each question must have at least 2 options.",
        });
      }
    }

    /* ---------- UPSERT QUESTION SET ---------- */
    const questionSet = await QuestionSet.findOneAndUpdate(
      { organization_id },
      { $set: { questions } },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Question set saved successfully.",
      data: questionSet,
    });
  } catch (error) {
    console.error("Error saving question set:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export const getQuestionSetByOrganizationId = async (req, res) => {
  try {
    const { organization_id } = req.params;

    if (!organization_id)
      return res.status(400).json({ error: "organization_id is required." });

    const questionSet = await QuestionSet.findOne({ organization_id }).lean();

    if (!questionSet)
      return res
        .status(404)
        .json({ error: "Question set not found for this organization." });

    return res.status(200).json(questionSet);
  } catch (error) {
    console.error("Error fetching question set:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
