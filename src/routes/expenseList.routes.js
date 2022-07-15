import express from "express";
import { 
    addExpense, 
    changeExpense, 
    getExpenseList, 
    removeExpense, 
    searchExpenseListByName
} from "../controllers/expenseLists.controllers.js";
import checkAuth from "../middleware/checkAuth.js";

const expenseListRouter = express.Router();

expenseListRouter.get("/", checkAuth, getExpenseList)
expenseListRouter.post("/", checkAuth, addExpense)
expenseListRouter.delete("/", checkAuth, removeExpense)
expenseListRouter.patch("/", checkAuth, changeExpense)
expenseListRouter.get("/searchByName/search=:search&page=:page&limit=:limit", checkAuth, searchExpenseListByName)



export  default expenseListRouter