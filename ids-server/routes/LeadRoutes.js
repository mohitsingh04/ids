import express from "express";
import {
  getAllLeads,
  getLeadByObjectId,
  getLeadsByOrganizationId,
} from "../controller/lead-controller/LeadController.js";
import {
  addOrUpdateLeadConversation,
  getAllLeadConversations,
  getConversationByLeadId,
} from "../controller/lead-controller/LeadConversationController.js";
import {
  upsertQuestionSet,
  getQuestionSetByOrganizationId,
} from "../controller/lead-controller/QuestionSetController.js";

const leadRoutes = express.Router();

leadRoutes.use(express.json());
leadRoutes.use(express.urlencoded({ extended: true }));

leadRoutes.get("/leads", getAllLeads);
leadRoutes.get("/leads/:objectId", getLeadByObjectId);
leadRoutes.get(
  "/leads/organization/:organization_id",
  getLeadsByOrganizationId
);

leadRoutes.post("/lead/conversation", addOrUpdateLeadConversation);
leadRoutes.get("/lead/conversation", getAllLeadConversations);
leadRoutes.get("/lead/conversation/:lead_id", getConversationByLeadId);

leadRoutes.post("/create/question-set", upsertQuestionSet);
leadRoutes.get(
  "/question-set/:organization_id",
  getQuestionSetByOrganizationId
);

export default leadRoutes;
