import express from "express";
import { 
    addExpense, 
    changeExpense, 
    getExpenseList, 
    removeExpense, 
    searchExpenseListByName,
    searchExpenseListByName2
} from "../controllers/expenseLists.controllers.js";
import checkAuth from "../middleware/checkAuth.js";

const expenseListRouter = express.Router();

expenseListRouter.get("/", checkAuth, getExpenseList)
expenseListRouter.post("/", checkAuth, addExpense)
expenseListRouter.delete("/", checkAuth, removeExpense)
expenseListRouter.patch("/", checkAuth, changeExpense)
expenseListRouter.get("/searchByName/search=:search&page=:page&limit=:limit&sortBy=:sortBy&desc=:desc", checkAuth, searchExpenseListByName)
expenseListRouter.get("/searchByName2/search=:search&page=:page&limit=:limit&sortBy=:sortBy&desc=:desc", checkAuth, searchExpenseListByName2)



export  default expenseListRouter