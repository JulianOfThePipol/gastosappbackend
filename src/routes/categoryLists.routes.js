import express from "express";
import { 
    getCategoryList 
} from "../controllers/categoryList.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryListRouter = express.Router();

categoryListRouter.get("/", checkAuth, getCategoryList)

export  default categoryListRouter