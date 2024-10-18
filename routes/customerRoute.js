import express from "express";
import { getCustomerById, updateCustomer } from "../controller/customerController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const route = express.Router();

route.get("/:id", isAuthenticated, getCustomerById);
route.put("", isAuthenticated, updateCustomer);

export default route;