import express from "express";
import { addAddress, getAddresses, updateAddress, updateDefaultAddress, deleteAddress, fetchCity, fetchDistrict, fetchWard } from "../controller/addressController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const route = express.Router();

route.get("/fetchCity", fetchCity);
route.get("/fetchDistrict/:city", fetchDistrict);
route.get("/fetchWard/:district", fetchWard);

route.post("", isAuthenticated, addAddress);
route.get("/:id", isAuthenticated, getAddresses);
route.put("", isAuthenticated, updateAddress);
route.delete("/:id", isAuthenticated, deleteAddress);
route.post("/updateDefaultAddress", isAuthenticated, updateDefaultAddress);


export default route;