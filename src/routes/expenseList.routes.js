import express from "express";
import { 
    addExpense, 
    changeExpense, 
    getExpenseList, 
    getExpensesPerMonth, 
    getTotalExpenses, 
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
expenseListRouter.get("/search", checkAuth, paramsHandler, searchExpense)
expenseListRouter.get("/getExpenses", checkAuth, paramsHandler, getTotalExpenses)
expenseListRouter.get("/getExpensesPerMonth", checkAuth, getExpensesPerMonth)

/* search=:search?&minValue=:minValue?&maxValue=:maxValue?&page=:page?&limit=:limit?&sortBy=:sortBy?&desc=:desc?&minDate=:minDate?&maxDate=:maxDate?&categoryID=:categoryID? */

export  default expenseListRouter