import express from "express";
import { getAllUsers } from "../controller/user.js";
import { checkAdmin, isAuth, checkGuider, checkAdminOrGuider } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getAllUsers", isAuth, checkAdminOrGuider, getAllUsers);
// router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
