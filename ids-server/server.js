"use strict";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

import path from "node:path";
import extraRoutes from "./routes/ExtraRoutes.js";
import assetRoutes from "./routes/AssetRoutes.js";
import leadRoutes from "./routes/LeadRoutes.js";
import organizationRoutes from "./routes/OrganizationRoutes.js";

dotenv.config();

const app = express();

app.use(express.static(path.resolve("../media")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const allowedOrigins = [process.env.IDS_APP_URL];

app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

function originGuard(req, res, next) {
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Your Are Non Allowed User" });
  }
  next();
}

app.use(originGuard);

app.get("/", (req, res) => {
  return res.redirect(process.env.IDS_APP_URL);
});

app.get("/api", (req, res) => {
  return res.redirect(process.env.IDS_APP_URL);
});
app.use("/api/", authRouter);
app.use("/api/", userRoutes);
app.use("/api/", extraRoutes);
app.use("/api/", assetRoutes);
app.use("/api/", leadRoutes);
app.use("/api/", organizationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
