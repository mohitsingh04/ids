import Organization from "../../models/organization-models/Organization.js";
import { getDataFromToken } from "../../utils/GetDatafromToken.js";

export const getOrganizationByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId)
      return res.status(400).json({ error: "Invalid or missing adminId." });

    const organization = await Organization.findOne({ adminId });

    if (!organization)
      return res
        .status(404)
        .json({ error: "Organization not found for this admin." });

    return res.status(200).json(organization);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const createOrganization = async (req, res) => {
  try {
    const { organization_name, members } = req.body;

    const adminId = await getDataFromToken(req);

    if (!organization_name || !members)
      return res
        .status(400)
        .json({ error: "All fields are required and adminId must be valid." });

    const existingOrganization = await Organization.findOne({ adminId });
    if (existingOrganization)
      return res.status(409).json({
        success: false,
        message: "This admin already has an organization.",
      });

    const newOrganization = new Organization({
      adminId,
      organization_name: organization_name.trim(),
      members: members.trim(),
    });

    await newOrganization.save();

    return res
      .status(201)
      .json({ message: "Organization created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
