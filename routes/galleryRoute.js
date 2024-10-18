import express from "express";
import { deleteGallery } from "../controller/galleryController.js";

const route = express.Router();

route.delete("/deleteGallery/:id", deleteGallery);


export default route;