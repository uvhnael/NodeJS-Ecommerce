import express from "express";
import { getCategories } from "../controller/categoryController.js";

const route = express.Router();

route.get("/getCategories", getCategories);

export default route;