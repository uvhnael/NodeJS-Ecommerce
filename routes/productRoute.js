import express from "express";
import { createProduct, updateProduct, deleteProduct, getProduct, getProductsSearch, getProducts, getProductsByIdList } from "../controller/productController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const route = express.Router();


route.post("/addProduct", createProduct);
route.put("/updateProduct/:id", updateProduct);
route.delete("/deleteProduct/:id", deleteProduct);
route.get("/getProduct/:id", getProduct);
route.get("/getProducts", getProducts);
route.post("/getProductsByIdList", getProductsByIdList);
route.get("/searchProduct/:search", getProductsSearch);

export default route;