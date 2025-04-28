import { db } from "../db/db.js";

// Get all transactions (with booking info)
export const getAllTransactions = (req, res) => {
  const q = `
  SELECT 
    t.*, 
    b.user_id, 
    b.package_id, 
    b.date AS booking_date,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email
  FROM transactions t
  JOIN bookings b ON t.booking_id = b.id
  JOIN users u ON b.user_id = u.id
`;

  db.query(q, (err, result) => {
    if (err) {
      console.log("Error fetching transactions:", err);
    } else {
      res.send(result);
    }
  });
};

export const getTotalTransactionAmount = (req, res) => {
  const q = "SELECT SUM(amount) AS total_amount FROM transactions";
  db.query(q, (err, result) => {
    if (err) {
      res.send("Error calculating total transaction amount:", err);
    } else {
      res.send(result[0]); // returns { total_amount: ... }
    }
  });
};

// Get a transaction by ID
export const getTransactionById = (req, res) => {
  const tid = req.params.id;
  const q = `
    SELECT t.*, b.user_id, b.package_id, b.date AS booking_date
    FROM transaction t
    JOIN booking b ON t.booking_id = b.id
    WHERE t.id = ?
  `;
  db.query(q, [tid], (err, result) => {
    if (err) {
      console.log("Error fetching transaction:", err);
    } else {
      res.send(result);
    }
  });
};

// Create a new transaction
export const createTransaction = (req, res) => {
  const { booking_id, amount, payment_date, status } = req.body;
  const cleanedAmount = parseInt(amount.replace(/,/g, ""), 10);
  const q = `
    INSERT INTO transactions (booking_id, amount, payment_date, status)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    q,
    [booking_id, cleanedAmount, payment_date, status],
    (err, result) => {
      if (err) {
        console.log("Error creating transaction:", err);
      } else {
        res.send({
          message: "Transaction created successfully",
          insertId: result.insertId,
        });
      }
    }
  );
};

// Update transaction
export const updateTransaction = (req, res) => {
  const tid = req.params.id;
  const { booking_id, amount, payment_date, status } = req.body;
  const q = `
    UPDATE transaction
    SET booking_id = ?, amount = ?, payment_date = ?, status = ?
    WHERE id = ?
  `;
  db.query(
    q,
    [booking_id, amount, payment_date, status, tid],
    (err, result) => {
      if (err) {
        console.log("Error updating transaction:", err);
      } else {
        res.send({ message: "Transaction updated successfully" });
      }
    }
  );
};

// Delete transaction
export const deleteTransaction = (req, res) => {
  const tid = req.params.id;
  const q = "DELETE FROM transaction WHERE id = ?";
  db.query(q, [tid], (err, result) => {
    if (err) {
      console.log("Error deleting transaction:", err);
    } else {
      res.send({ message: "Transaction deleted successfully" });
    }
  });
};

// (Optional) Get transactions by booking ID
export const getTransactionsByBookingId = (req, res) => {
  const bid = req.params.booking_id;
  const q = "SELECT * FROM transaction WHERE booking_id = ?";
  db.query(q, [bid], (err, result) => {
    if (err) {
      console.log("Error fetching by booking ID:", err);
    } else {
      res.send(result);
    }
  });
};
