import express from "express";
import { getAllBookingByUser, getAllBookingDetails } from "../controller/booking.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getAllBookingDetails", isAuth, checkAdmin, getAllBookingDetails);
router.get("/getBookingByUser/:id", isAuth, getAllBookingByUser);
// router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
