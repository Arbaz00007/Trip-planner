import { db } from "../db/db.js";
export const getAllBookingDetails = (req, res) => {
  const sql = `SELECT 
    b.*,b.id as booking_id,      
    u.*,       
    p.*,        
    COALESCE(GROUP_CONCAT(i.image), '') AS images 
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN package p ON b.package_id = p.pid
LEFT JOIN image i ON p.pid = i.pid  
GROUP BY b.id, u.id, p.pid;`;
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

export const getAllBookingByUser = (req, res) => {
  const uid = req.params.id;
  const query = req.query;

  console.log(uid, ":UID");
  // console.log(query.status === "Pending");

  if (query.status === "Pending") {
    const q = `
      SELECT 
        b.*,      
        u.*,       
        p.*,        
        COALESCE(GROUP_CONCAT(i.image), '') AS images 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN package p ON b.package_id = p.pid
      LEFT JOIN image i ON p.pid = i.pid  
      WHERE b.user_id = ? AND b.status = "Pending" 
      GROUP BY b.id, u.id, p.pid;
    `;

    db.query(q, [parseInt(uid)], (err, results) => {
      if (err) {
        console.error("Error aayo:", err);
        return res
          .status(500)
          .json({ error: "An error occurred", details: err.message });
      }
      res.status(200).json(results);
    });
  } else if (query.status === "Completed") {
    const q = `
      SELECT 
        b.*,      
        u.*,       
        p.*,        
        COALESCE(GROUP_CONCAT(i.image), '') AS images 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN package p ON b.package_id = p.pid
      LEFT JOIN image i ON p.pid = i.pid  
      WHERE b.user_id = ? AND b.status = "Completed" 
      GROUP BY b.id, u.id, p.pid;
    `;

    db.query(q, [parseInt(uid)], (err, results) => {
      if (err) {
        console.error("Error aayo:", err);
        return res
          .status(500)
          .json({ error: "An error occurred", details: err.message });
      }
      res.status(200).json(results);
    });
  } else {
    const q = `
      SELECT 
        b.*,      
        u.*,       
        p.*,        
        COALESCE(GROUP_CONCAT(i.image), '') AS images 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN package p ON b.package_id = p.pid
      LEFT JOIN image i ON p.pid = i.pid  
      WHERE b.user_id = ? AND b.status = "Cancelled" 
      GROUP BY b.id, u.id, p.pid;
    `;

    db.query(q, [parseInt(uid)], (err, results) => {
      if (err) {
        console.error("Error aayo:", err);
        return res
          .status(500)
          .json({ error: "An error occurred", details: err.message });
      }
      res.status(200).json(results);
    });
  }
};

export const compeleteBooking = (req, res) => {
  const { bid, pid } = req.params;

  const sql = `UPDATE bookings SET status = "Completed" WHERE id = ?; 
  Update package SET isBooked = "Not-booked" WHERE pid = ?;`;
  db.query(sql, [parseInt(bid), parseInt(pid)], (err, results) => {
    if (err) {
      console.error("Error aayo:", err);
      return res
        .status(500)
        .json({ error: "An error occurred", details: err.message });
    }
    res.status(200).json({ message: "Booking Completed.." });
  });
};
