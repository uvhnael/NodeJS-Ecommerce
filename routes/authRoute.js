import express from "express";
import { login, googleLogin, register, updatePassword, isJWTValid, verifyOTP, sendOTP, updateActive } from "../controller/authController.js";

const route = express.Router();

route.post("/register", register);
route.post("/googleLogin", googleLogin);
route.post("/login", login);
route.post("/updatePassword", updatePassword);
route.post("/isJWTValid", isJWTValid);
route.post("/sendOTP", sendOTP);
route.post("/verifyOTP", verifyOTP);
route.post("/updateActive", updateActive);

export default route;