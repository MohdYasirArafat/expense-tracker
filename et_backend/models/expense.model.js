const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Food",
      "Transport",
      "Rent",
      "Shopping",
      "Entertainment",
      "Salary",
      "Health",
      "Others",
    ],
    default: "Others",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;