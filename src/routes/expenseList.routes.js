import express from "express";
import { 
    addExpense, 
    changeExpense, 
    getExpenseList, 
    removeExpense, 
    searchExpense, 
} from "../controllers/expenseLists.controllers.js";
import checkAuth from "../middleware/checkAuth.js";
import paramsHandler from "../middleware/paramsHandler.js";

const expenseListRouter = express.Router();

expenseListRouter.get("/", checkAuth, getExpenseList)
expenseListRouter.post("/", checkAuth, addExpense)
expenseListRouter.delete("/", checkAuth, removeExpense)
expenseListRouter.patch("/", checkAuth, changeExpense)
expenseListRouter.get("/search/search=:search?&minValue=:minValue?&maxValue=:maxValue?&page=:page?&limit=:limit?&sortBy=:sortBy?&desc=:desc?&minDate=:minDate?&maxDate=:maxDate?", checkAuth, paramsHandler, searchExpense)



export  default expenseListRouter