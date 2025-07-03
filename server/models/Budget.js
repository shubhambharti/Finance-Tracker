const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true },
});

module.exports = mongoose.model("Budget", budgetSchema);
