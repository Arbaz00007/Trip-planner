import express from "express";
import { verifyEsewa, handleEsewaSuccess } from "../controller/esewa.js";

const router = express.Router();

router.get("/verifyEsewa/:id", verifyEsewa);
router.get("/success/:pid/:uid/:date", handleEsewaSuccess);

export default router;
