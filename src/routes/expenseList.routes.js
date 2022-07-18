import express from "express";
import { 
    addExpense, 
    changeExpense, 
    getExpenseList, 
    removeExpense, 
    searchExpenseListByName,
    searchExpenseListByValue
} from "../controllers/expenseLists.controllers.js";
import checkAuth from "../middleware/checkAuth.js";
import paramsHandler from "../middleware/paramsHandler.js";

const expenseListRouter = express.Router();

expenseListRouter.get("/", checkAuth, getExpenseList)
expenseListRouter.post("/", checkAuth, addExpense)
expenseListRouter.delete("/", checkAuth, removeExpense)
expenseListRouter.patch("/", checkAuth, changeExpense)
expenseListRouter.get("/searchByName/search=:search?&page=:page?&limit=:limit?&sortBy=:sortBy?&desc=:desc?", checkAuth, paramsHandler, searchExpenseListByName)
expenseListRouter.get("/searchByValue/minValue=:minValue?&maxValue=:maxValue?&page=:page?&limit=:limit?&sortBy=:sortBy?&desc=:desc?", checkAuth, paramsHandler, searchExpenseListByValue)




export  default expenseListRouter