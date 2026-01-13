import LeadConversation from "../../models/lead-models/LeadConversation.js";
import NextFollowUp from "../../models/lead-models/NextFollowUp.js";

export const addOrUpdateLeadConversation = async (req, res) => {
  try {
    const {
      lead_id,
      questions,
      status,
      message,
      rating,
      submitQuestion,
      overallAnswerScore,
      overallLeadScore,
      next_follow_up_date,
      next_follow_up_time,
    } = req.body;

    if (!lead_id) {
      return res.status(400).json({ error: "Invalid lead_id." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Questions are required." });
    }

    const conversation = await LeadConversation.findOneAndUpdate(
      { lead_id },
      {
        $set: {
          status,
          message,
          rating,
          submitQuestion,
          overallAnswerScore,
          overallLeadScore,
        },
        $push: {
          questions: {
            $each: questions,
          },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    if (next_follow_up_date || next_follow_up_time) {
      await NextFollowUp({ next_follow_up_date, next_follow_up_time }).save();
    }

    return res.status(200).json({
      message: "Conversation saved successfully.",
      data: conversation,
    });
  } catch (error) {
    console.error("Add/Update Conversation Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getConversationByLeadId = async (req, res) => {
  try {
    const { lead_id } = req.params;

    if (!lead_id)
      return res.status(400).json({ error: "lead_id is required." });
    const conversation = await LeadConversation.findOne({ lead_id });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found." });

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Get Conversation Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getAllLeadConversations = async (req, res) => {
  try {
    const conversations = await LeadConversation.find();

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Get Conversation Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
