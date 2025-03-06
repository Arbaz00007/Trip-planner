import express from "express";
// import { getAllUsers } from "../controller/user.js";
import { getAllGuider } from "../controller/guider.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getAllGuider", isAuth, checkAdmin, getAllGuider);
// router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
