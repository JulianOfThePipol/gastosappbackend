import express from "express";
import { 
    getCategoryList,
    addCategory,
    removeCategory,
    changeCategory,
    addCategoryLimit,
    getCategoryLimit
} from "../controllers/categoryList.controller.js";
import checkAuth from "../middleware/checkAuth.js";


const categoryListRouter = express.Router();

categoryListRouter.get("/", checkAuth, getCategoryList)
categoryListRouter.post("/", checkAuth, addCategory)
categoryListRouter.delete("/", checkAuth, removeCategory)
categoryListRouter.patch("/", checkAuth, changeCategory)
categoryListRouter.post("/limit", checkAuth, addCategoryLimit)
categoryListRouter.get("/limit", checkAuth, getCategoryLimit)

export  default categoryListRouter