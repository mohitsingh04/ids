import express from "express";
import {
  CreateStatus,
  deleteStatus,
  getAllStatus,
  updateStatus,
} from "../controller/asset-controller/StatusController.js";

const assetRoutes = express.Router();
assetRoutes.use(express.json());
assetRoutes.use(express.urlencoded({ extended: true }));

assetRoutes.get("/status", getAllStatus);
assetRoutes.post("/status", CreateStatus);
assetRoutes.patch("/status/:objectId", updateStatus);
assetRoutes.delete("/status/:objectId", deleteStatus);

export default assetRoutes;
