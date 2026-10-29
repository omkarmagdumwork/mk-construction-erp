import mongoose from "mongoose";
import Expense from "../models/Expense.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createExpense = async (req, res) => {
  try {
    const { project, title, amount } = req.body;

    if (!project || !title || amount === undefined) {
      return res
        .status(400)
        .json({ message: "Project, title and amount are required" });
    }

    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: ?project=<id>&category=labour
export const getExpenses = async (req, res) => {
  try {
    const { project, category } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (category) filter.category = category;

    const expenses = await Expense.find(filter)
      .populate("project", "name")
      .sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Totals by category. Optional: ?project=<id>
export const getExpenseSummary = async (req, res) => {
  try {
    const { project } = req.query;
    const match = {};

    if (project) {
      if (!isValidId(project)) {
        return res.status(400).json({ message: "Invalid project id" });
      }
      match.project = new mongoose.Types.ObjectId(project);
    }

    const byCategory = await Expense.aggregate([
      { $match: match },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = byCategory.reduce((sum, item) => sum + item.total, 0);

    res.json({ grandTotal, byCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const expense = await Expense.findById(req.params.id).populate("project", "name");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};