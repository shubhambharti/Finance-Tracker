const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

router.post("/", async (req, res) => {
  try {
    console.log("Incoming budget body:", req.body);
    const { userId, category, amount } = req.body;
    const month = new Date().toISOString().slice(0, 7); // "2025-07"

    const budget = await Budget.findOneAndUpdate(
      { userId, category, month },
      { limit: amount },
      { new: true, upsert: true }
    );

    res.json(budget);
  } catch (err) {
    console.error("POST /budgets error:", err);
    res.status(500).json({ msg: "Failed to save budget" });
  }
});

router.get("/alerts", async (req, res) => {
  const { userId, month } = req.query;
  console.log("ALERTS API HIT", { userId, month });

  try {
    const budgets = await Budget.find({ userId, month });
    console.log("Fetched Budgets:", budgets);

    const start = new Date(`${month}-01`);
    const end = new Date(`${month}-31`);

    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    });
    console.log("Fetched Expenses:", expenses);

    const alerts = budgets.map((budget) => {
      const totalSpent = expenses
        .filter((e) => e.category === budget.category)
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      const percent = Math.round((totalSpent / budget.limit) * 100);
      return {
        _id: budget._id,
        category: budget.category,
        percent,
      };
    });

    console.log("Final Alerts:", alerts);
    res.json(alerts);
  } catch (err) {
    console.error("GET /alerts error:", err);
    res.status(500).send({ msg: "Error fetching alerts", error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.params.userId });
    res.json(budgets);
  } catch (err) {
    console.error("GET /budgets/:userId error:", err);
    res.status(500).json({ msg: "Failed to fetch budgets" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ msg: "Budget deleted" });
  } catch (err) {
    console.error("DELETE /budgets/:id error:", err);
    res.status(500).json({ msg: "Failed to delete budget" });
  }
});

module.exports = router;
