import express from "express";
import {
  getAllBookingByUser,
  getAllBookingDetails,
  compeleteBooking,
} from "../controller/booking.js";
import { checkAdmin, isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/getAllBookingDetails", isAuth, getAllBookingDetails);
router.get("/getBookingByUser/:id", isAuth, getAllBookingByUser);
router.post("/compeleteBooking/:bid/:pid", isAuth, compeleteBooking);
// router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
