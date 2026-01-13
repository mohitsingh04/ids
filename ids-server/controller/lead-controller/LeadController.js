import Lead from "../../models/lead-models/Lead.js";

export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    return res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
export const getLeadsByOrganizationId = async (req, res) => {
  try {
    const { organization_id } = req.params;
    const leads = await Lead.find({ organization_id });
    return res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getLeadByObjectId = async (req, res) => {
  try {
    const { objectId } = req.params;
    const leads = await Lead.findOne({_id: objectId });
    return res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
