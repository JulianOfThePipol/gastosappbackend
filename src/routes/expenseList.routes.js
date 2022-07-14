import express from "express";
import { 
    addExpense, 
    getExpenseList, 
    removeExpense 
} from "../controllers/expenseLists.controllers.js";
import checkAuth from "../middleware/checkAuth.js";

const expenseListRouter = express.Router();

expenseListRouter.get("/", checkAuth, getExpenseList)
expenseListRouter.post("/", checkAuth, addExpense)
expenseListRouter.delete("/", checkAuth, removeExpense)



export  default expenseListRouter