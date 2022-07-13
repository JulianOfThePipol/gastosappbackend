import express from "express";
import { 
    getCategoryList,
    addCategory,
    removeCategory
} from "../controllers/categoryList.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryListRouter = express.Router();

categoryListRouter.get("/", checkAuth, getCategoryList)
categoryListRouter.post("/", checkAuth, addCategory)
categoryListRouter.delete("/", checkAuth, removeCategory)

export  default categoryListRouter