import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByBookingId,
  getTotalTransactionAmount,
} from "../controller/transaction.js";

import { isAuth, checkAdmin } from "../middleware/isAuth.js";

const router = express.Router();

// All transactions (only Admin can see all)
router.get("/getAllTransactions", isAuth, checkAdmin, getAllTransactions);

// Get transaction by ID
router.get("/getTransaction/:id", isAuth, getTransactionById);

// Get transactions by Booking ID (optional route)
router.get("/getByBooking/:booking_id", isAuth, getTransactionsByBookingId);

// Create a new transaction
router.post("/create", isAuth, createTransaction);

// Update a transaction
router.put("/update/:id", isAuth, updateTransaction);

// Delete a transaction
router.delete("/delete/:id", isAuth, deleteTransaction);

router.get("/totalAmount", isAuth, getTotalTransactionAmount);

export default router;
