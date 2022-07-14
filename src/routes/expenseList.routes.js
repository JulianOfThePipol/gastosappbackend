import express from "express";
import { addExpense, getExpenseList } from "../controllers/expenseLists.controllers";

const expenseListRouter = express.Router();

categoryListRouter.get("/", checkAuth, getExpenseList)
categoryListRouter.post("/", checkAuth, addExpense)



export  default expenseListRouter