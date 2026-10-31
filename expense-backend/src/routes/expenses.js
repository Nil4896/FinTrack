const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post("/", auth, async (req, res) => {
  const { title, amount, category, date, notes } = req.body;

  try {
    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category: category || "Other", // ✅ default if none selected
      date: date ? new Date(date) : Date.now(), // ✅ ensures proper date format
      notes,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err.message);
    res.status(500).json({ message: "Failed to add expense" });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses for the logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an existing expense
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, amount, category, date, notes } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    // ✅ Update only provided fields
    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date ? new Date(date) : expense.date;
    expense.notes = notes || expense.notes;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("Error updating expense:", err.message);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err.message);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;
