import { db } from "../db/db.js";
export const getAllUsers = (req, res) => {
  db.query("SELECT * FROM users where role_id = 3", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};
export const getUserById = (req, res) => {
  const uid = req.params.uid;
  // console.log(uid, ":UID");

  db.query("SELECT * FROM users WHERE id = ?", uid, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};
export const updateUser = async (req, res) => {
  const { uid } = req.params; // user id from URL
  console.log(uid, ":Uid");
  console.log(req.body, ":REQ");

  const { name, address, phone } = req.body;

  try {
    // Check if user exists
    const checkUserQuery = "SELECT * FROM `users` WHERE `id` = ?";
    db.query(checkUserQuery, [uid], async (err, data) => {
      if (err)
        return res.status(500).json({ error: "Database error.", details: err });
      if (data.length === 0)
        return res.status(404).json({ error: "User not found." });

      // Update user
      const updateQuery = `
        UPDATE users SET name = ?,address = ?,phone = ? WHERE id = ?
      `;

      const values = [name, address, phone, parseInt(uid)];

      db.query(updateQuery, values, (updateErr, result) => {
        if (updateErr)
          return res
            .status(500)
            .json({ error: "Update failed.", details: updateErr });

        res.status(200).json({ message: "User updated successfully." });
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong.", details: error.message });
  }
};
export const deleteUser = (req, res) => {
  const uid = req.params.uid;
  db.query("DELETE FROM users WHERE id = ?", uid, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};
