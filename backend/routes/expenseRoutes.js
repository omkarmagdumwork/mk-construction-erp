import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseSummary,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getExpenses).post(createExpense);
router.get("/summary", getExpenseSummary);
router
  .route("/:id")
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;