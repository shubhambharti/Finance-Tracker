const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { month } = req.query;

  try {
    const start = new Date(`${month}-01`);
    const end = new Date(`${month}-31`);

    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals = {};
    const methodCounts = {};
    const dailySpending = {};

    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      methodCounts[e.method] = (methodCounts[e.method] || 0) + 1;
      const day = new Date(e.date).getDate();
      dailySpending[day] = (dailySpending[day] || 0) + e.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    const topMethods = Object.entries(methodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((m) => m[0]);

    res.json({
      total,
      topCategory,
      topMethods,
      categoryData: categoryTotals,
      dailyData: dailySpending,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ msg: "Dashboard fetch failed" });
  }
});

module.exports = router;
