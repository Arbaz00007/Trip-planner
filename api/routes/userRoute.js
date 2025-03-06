import express from "express";
import { getAllUsers } from "../controller/user.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getAllUsers", isAuth, checkAdmin, getAllUsers);
// router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
