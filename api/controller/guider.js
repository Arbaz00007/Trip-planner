import { db } from "../db/db.js";
export const getAllGuider = (req, res) => {
  const sql = `SELECT * FROM users where role_id = 2`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error aayo:", err);
      return res
        .status(500)
        .json({ error: "An error occurred", details: err.message });
    }
    res.status(200).json(results);
  });
};
