import { db } from "../db/db.js";
export const sendNotification = (req, res, io) => {
  const { message, title } = req.body;
  // console.log(message, ":Message");

  if (!message) return res.status(400).json({ error: "Message is required" });

  // Insert into MySQL
  db.query(
    "INSERT INTO notification (title,message) VALUES (?,?)",
    [title, message],
    (err, result) => {
      if (err) return res.status(500).json(err);
      db.query(
        "SELECT * FROM notification WHERE id = ?",
        [result.insertId],
        (errr, newNotification) => {
          if (errr) return res.status(500).json(errr);
          // console.log(newNotification, ":New Notification: ");

          io.emit("notification", newNotification[0]);

          res.json({ success: true, message: "Notification sent and stored!" });
        }
      );
    }
  );

  // Emit the new notification to clients
};

export const getAllNotifications = (req, res) => {
  try {
    db.query(
      "SELECT * FROM notification ORDER BY created_at DESC",
      (err, rows) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error fetching notifications" });
        }
        res.json(rows);
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};
