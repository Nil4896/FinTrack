// src/models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Food & Dining",
      "Transportation",
      "Housing",
      "Bills & Utilities",
      "Shopping",
      "Health & Fitness",
      "Entertainment",
      "Education",
      "Travel",
      "Personal Care",
      "Savings & Investments",
      "Gifts & Donations",
      "Other"
    ],
    default: "Other", // ✅ Default category
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
