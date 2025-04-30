import express from "express";
import {
  getReviewsByTour,
  deleteReview,
  updateReview,
  addReview,
} from "../controller/review.js";

const router = express.Router();

router.post("/create-review", addReview);
router.get("/get-review-by-package/:tour_id", getReviewsByTour);
router.post("update-review/:id", updateReview);
router.post("delete-review/:id", deleteReview);

export default router;
