const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { addExpense , getExpense, updateExpense, deleteExpense, getSummary, getCategory } = require("../controllers/expense.controller.js");


const expenseRouter = express.Router();

//user routes
expenseRouter.post('/add',authMiddleware,addExpense );
expenseRouter.get('/list',authMiddleware,getExpense);
expenseRouter.put('/edit/:id',authMiddleware,updateExpense);
expenseRouter.delete('/delete/:id',authMiddleware,deleteExpense);


expenseRouter.get("/summary", authMiddleware, getSummary);
expenseRouter.get("/category", authMiddleware, getCategory);




module.exports = expenseRouter;