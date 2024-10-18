import express from "express";
import { fetchOrderCoupon, fetchProductCoupon } from "../controller/couponController.js";

const route = express.Router();

route.post("", fetchProductCoupon);
route.get("", fetchOrderCoupon);

export default route;