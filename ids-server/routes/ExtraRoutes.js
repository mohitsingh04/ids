import express from "express";
import {
  getCity,
  getCountry,
  getState,
} from "../controller/extra-controller/ExtraControllers.js";

const extraRoutes = express.Router();
extraRoutes.use(express.json());
extraRoutes.use(express.urlencoded({ extended: true }));

extraRoutes.get(`/countries`, getCountry);
extraRoutes.get(`/states`, getState);
extraRoutes.get(`/cities`, getCity);

export default extraRoutes;
