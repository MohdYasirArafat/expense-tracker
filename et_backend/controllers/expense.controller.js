const Expense = require("../models/expense.model.js");
const User = require("../models/user.model.js");

//create expense
const addExpense = async (req, res) => {
  try {
    const { title, amount, description, category, date } = req.body;

    if (!title || !amount || !description) {
      return res.status(400).json({ message: "Required missing field !" });
    }

    const expense = await Expense.create({
      title,
      amount,
      description,
      category, 
      user: req.user.id, //auth middleware se  aayega
    });

    res.status(201).json({ message: "expenses created !", expense });
  } catch (error) {
    console.log(error);
  }
};

//list expense
// const getExpense = async (req, res) => {
//   try {
//     const expenses = await Expense.find({ user: req.user.id });

//     res.status(200).json({ message: "all expense showing", expenses });
//   } catch (error) {
//     console.log("getExpense Error", error);
//   }
// };

const getExpense = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category, from, to } = req.query;

    const query = { user: req.user.id };

    //  SEARCH
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    //  CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    //  DATE FILTER
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

// update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
       { returnDocument: 'after', runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Expense delete successfully",
      deletedExpense,
    });
  } catch (error) {
    console.log("delete error", error);
  }
};

///get summaery
const getSummary = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const userId = req.user.id; // Ya req.user._id jo aap use kar rahe hain

    const totals = await Expense.aggregate([
      // 1. Sirf current user ke expenses filter karein
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      
      // 2. Conditional group karein (Salary = Income, Baki sab = Expense)
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$category", "Salary"] }, "$amount", 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $ne: ["$category", "Salary"] }, "$amount", 0] }
          }
        }
      }
    ]);

    // Agar data nahi mila toh default 0 rakhein
    const income = totals[0]?.totalIncome || 0;
    const expense = totals[0]?.totalExpense || 0;
    const balance = income - expense; // Correct Formula

    return res.status(200).json({
      income,
      expense,
      balance
    });

  } catch (error) {
    console.error("Summary error:", error);
    return res.status(500).json({ message: "Error calculating summary" });
  }
};


const getCategory = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const userId = req.user.id;

    const chartData = await Expense.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          category: { $ne: "Salary" } // ✅ Salary ko chart se hata dein taaki sirf kharche dikhein
        } 
      },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" } // Frontend Recharts 'value' field expect karta hai
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Frontend Recharts 'name' field expect karta hai
          value: 1
        }
      }
    ]);

    return res.status(200).json(chartData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching category data" });
  }
};


module.exports = {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getCategory
};
