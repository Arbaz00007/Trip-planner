// controllers/reviewController.js

import { db } from "../db/db.js";

// Get all reviews for a specific tour
export const getReviewsByTour = (req, res) => {
  const tour_id = req.params.tour_id;
  db.query(
    `SELECT r.*, u.name AS reviewer_name 
     FROM reviews r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.tour_id = ?`,
    [tour_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};

// Add a new review
export const addReview = (req, res) => {
  console.log(req.body, ":req.body");

  const { userId, packageId, rating, comment } = req.body;
  const checkQuery = "SELECT * FROM reviews WHERE user_id = ? AND tour_id = ?";

  db.query(checkQuery, [userId, parseInt(packageId)], (err, existing) => {
    if (err) {
      console.log(err);
    } else if (existing.length > 0) {
      res.status(400).send({ message: "You already reviewed this tour." });
    } else {
      const insertQuery =
        "INSERT INTO reviews (user_id, tour_id, rating, comment) VALUES (?, ?, ?, ?)";
      db.query(
        insertQuery,
        [userId, parseInt(packageId), rating, comment],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send({ message: "Review added successfully." });
          }
        }
      );
    }
  });
};

// Update a review
export const updateReview = (req, res) => {
  const review_id = req.params.id;
  const { rating, comment } = req.body;

  db.query(
    "UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?",
    [rating, comment, review_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ message: "Review updated successfully." });
      }
    }
  );
};

// Delete a review
export const deleteReview = (req, res) => {
  const review_id = req.params.id;

  db.query("DELETE FROM reviews WHERE id = ?", [review_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ message: "Review deleted successfully." });
    }
  });
};
