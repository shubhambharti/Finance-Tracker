const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.user.id });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add expense" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch expenses" });
  }
});

router.delete("/:id", async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).send("Expense not found");
  res.send({ message: "Expense deleted" });
});

router.put("/:id", async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).send("Expense not found");
  res.send(updated);
});

module.exports = router;
