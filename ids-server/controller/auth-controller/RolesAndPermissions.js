import UserPermissions from "../../models/user-models/Permissions.js";
import RegularUser from "../../models/user-models/RegularUser.js";
import UserRoles from "../../models/user-models/Roles.js";

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await UserPermissions.find();
    return res.status(200).json(permissions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await UserRoles.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPermissions = async (req, res) => {
  try {
    let { title, roles, permissions } = req.body;

    if (
      !title ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      !Array.isArray(permissions)
    )
      return res.status(400).json({ message: "Missing or invalid fields." });

    title = title.trim().toLowerCase();

    const normalizedPermissions = permissions
      .filter((p) => p?.title && p.title.trim() !== "")
      .map((p) => ({
        ...p,
        title: p.title.trim().toLowerCase(),
      }));

    const uniquePermissions = [
      ...new Map(normalizedPermissions.map((p) => [p.title, p])).values(),
    ];

    const existingRoles = await UserRoles.find({ _id: { $in: roles } });
    if (existingRoles.length !== roles.length)
      return res
        .status(404)
        .json({ message: "One or more roles do not exist." });

    const existingGroup = await UserPermissions.findOne({
      title,
      roles: { $in: roles },
    });

    if (existingGroup) {
      existingGroup.permissions = uniquePermissions;
      existingGroup.roles = roles;

      await existingGroup.save();

      return res
        .status(200)
        .json({ message: "Permissions updated successfully." });
    }

    await UserPermissions.create({
      title,
      roles,
      permissions: uniquePermissions,
    });

    return res
      .status(201)
      .json({ message: "Permissions created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateUserPermissions = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { permissions } = req.body;

    await RegularUser.findByIdAndUpdate(objectId, { permissions });
    return res.json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
