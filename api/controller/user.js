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
  db.query("SELECT * FROM users WHERE user_id = ?", uid, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};
