import express from "express";
import {
  createOrganization,
  getOrganizationByAdminId,
} from "../controller/organization-controller/OrganizationController.js";

const organizationRoutes = express.Router();
organizationRoutes.use(express.json());
organizationRoutes.use(express.urlencoded({ extended: true }));

organizationRoutes.get(
  "/organization/admin/:adminId",
  getOrganizationByAdminId
);
organizationRoutes.post("/organization/create", createOrganization);

export default organizationRoutes;
