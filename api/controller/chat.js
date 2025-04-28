import { db } from "../db/db.js";

export const sendMessage = (req, res) => {
  const { package_id, receiver_id, message } = req.body;
  const sender_id = req.user.id;

  db.query(
    `INSERT INTO chats (package_id, sender_id, receiver_id, message) 
     VALUES (?, ?, ?, ?)`,
    [package_id, sender_id, receiver_id, message],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      db.query(
        `SELECT c.*, u.name as sender_name, u.role_id as sender_role
         FROM chats c
         JOIN users u ON u.id = c.sender_id
         WHERE c.id = ?`,
        [result.insertId],
        (err, [newMessage]) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }

          // Emit socket event
          req.app.get("io").emit("sendMessage", newMessage);
          res.status(200).json({ success: true, data: newMessage });
        }
      );
    }
  );
};

export const getMessages = (req, res) => {
  const { package_id } = req.query;

  db.query(
    `SELECT c.*, u.name as sender_name, u.role_id as sender_role
     FROM chats c
     JOIN users u ON u.id = c.sender_id
     WHERE c.package_id = ?
     ORDER BY c.timestamp ASC`,
    [package_id],
    (err, messages) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      // Mark messages as read if current user is the receiver
      if (messages.length > 0) {
        db.query(
          `UPDATE chats SET is_read = TRUE 
           WHERE package_id = ? AND receiver_id = ? AND is_read = FALSE`,
          [package_id, req.user.id]
        );
      }

      res.status(200).json({ success: true, data: messages });
    }
  );
};

export const getConversations = (req, res) => {
  const userId = req.params.user_id;

  db.query(
    `SELECT 
       p.pid as package_id,
       p.pname as package_name,
       u.id as other_user_id,
       u.name as other_user_name,
       u.role_id as other_user_role,
       MAX(c.id) as last_message_id,
       SUM(CASE WHEN c.is_read = FALSE AND c.receiver_id = ? THEN 1 ELSE 0 END) as unread_count
     FROM chats c
     JOIN package p ON p.pid = c.package_id
     JOIN users u ON u.id = CASE 
       WHEN c.sender_id = ? THEN c.receiver_id 
       ELSE c.sender_id 
     END
     WHERE c.sender_id = ? OR c.receiver_id = ?
     GROUP BY p.pid, u.id
     ORDER BY MAX(c.timestamp) DESC`,
    [userId, userId, userId, userId],
    (err, conversations) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      // Get last message for each conversation
      const conversationPromises = conversations.map((conv) => {
        return new Promise((resolve, reject) => {
          db.query(
            `SELECT c.*, u.name as sender_name 
             FROM chats c
             JOIN users u ON u.id = c.sender_id
             WHERE c.id = ?`,
            [conv.last_message_id],
            (err, [message]) => {
              if (err) return reject(err);
              resolve({ ...conv, lastMessage: message });
            }
          );
        });
      });

      Promise.all(conversationPromises)
        .then((conversationsWithMessages) => {
          res
            .status(200)
            .json({ success: true, data: conversationsWithMessages });
        })
        .catch((error) => {
          res.status(500).json({ success: false, message: error.message });
        });
    }
  );
};
