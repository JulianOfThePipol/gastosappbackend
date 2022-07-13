import express from "express";
import { 
    getCategoryList,
    addCategory,
    removeCategory,
    changeCategory
} from "../controllers/categoryList.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryListRouter = express.Router();

categoryListRouter.get("/", checkAuth, getCategoryList)
categoryListRouter.post("/", checkAuth, addCategory)
categoryListRouter.delete("/", checkAuth, removeCategory)
categoryListRouter.patch("/", checkAuth, changeCategory)

export  default categoryListRouter