import express from "express";
import { create, update, deleteCartItem, getCartByCID, getCartOrderItems } from "../controller/cartController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const route = express.Router();

route.post("", isAuthenticated, create);
route.put("", isAuthenticated, update);
route.delete("/:id", isAuthenticated, deleteCartItem);
route.get("/:id", isAuthenticated, getCartByCID);
route.post("/getCartOrderItems", isAuthenticated, getCartOrderItems);


export default route;