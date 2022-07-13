import express from "express";
import { 
    getCategoryList,
    addCategory
} from "../controllers/categoryList.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryListRouter = express.Router();

categoryListRouter.get("/", checkAuth, getCategoryList)
categoryListRouter.post("/", checkAuth, addCategory)

export  default categoryListRouter