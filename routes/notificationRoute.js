import express from "express";
import { addCustomerToken, sendNotification, seen, sendWebNotification, getNotification } from "../controller/notificationController.js";

const route = express.Router();

route.post("/addCustomerToken", addCustomerToken);
route.post("/sendNotification", sendNotification);
route.post("/sendWebNotification", sendWebNotification);
route.get("/getNotification/:email", getNotification);
route.post("/seen/:id", seen);

export default route;