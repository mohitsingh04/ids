import Status from "../../models/assets-models/Status.js";

export const getAllStatus = async (req, res) => {
  try {
    const status = await Status.find().sort({ name: 1 });
    return res.status(200).json(status);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const CreateStatus = async (req, res) => {
  try {
    const { status_name, parent_status, description } = req.body;

    const existStatus = await Status.findOne({
      name: status_name,
      parent_status,
    });
    if (existStatus)
      return res.status(400).json({ error: "This status already exists." });

    const newStatus = new Status({
      status_name,
      parent_status,
      description,
    });

    await newStatus.save();
    return res.status(201).json({ message: "Status added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { status_name, parent_status, description } = req.body;

    const existStatus = await Status.findOne({
      status_name,
      parent_status,
      _id: { $ne: objectId },
    });

    if (existStatus)
      return res.status(400).json({ error: "This status already exists." });

    const updatedStatus = await Status.findByIdAndUpdate(objectId, {
      name: status_name,
      parent_status,
      description,
    });

    if (!updatedStatus)
      return res.status(404).json({ error: "Status not found." });

    return res.status(200).json({ message: "Status updated successfully." });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const { objectId } = req.params;

    const deletedStatus = await Status.findByIdAndDelete(objectId);

    if (!deletedStatus)
      return res.status(404).json({ error: "Status not found." });

    return res.status(200).json({ message: "Status deleted successfully." });
  } catch (err) {
    console.error("Error deleting status:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
