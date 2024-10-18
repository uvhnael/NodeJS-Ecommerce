import express from "express";
import { create, update, getOrderItems, getOrderByCID, getOrderItemsByCID } from "../controller/orderController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const route = express.Router();

route.post("", isAuthenticated, create);
route.put("", isAuthenticated, update);
route.get("/getOrderItems/:id", isAuthenticated, getOrderItems);
route.get("/getOrder/:id", isAuthenticated, getOrderByCID);
route.get("/getOrderItemsByCID/:id", isAuthenticated, getOrderItemsByCID);

export default route;