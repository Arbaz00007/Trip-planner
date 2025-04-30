import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/user.js";
import {
  checkAdmin,
  isAuth,
  checkGuider,
  checkAdminOrGuider,
} from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getAllUsers", isAuth, checkAdminOrGuider, getAllUsers);
router.get("/get-user-by-id/:uid", isAuth, checkAdminOrGuider, getUserById);
router.post("/update-user/:uid", isAuth, checkAdminOrGuider, updateUser);
router.post("/delete-user/:uid", isAuth, checkAdminOrGuider, deleteUser);
// router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
