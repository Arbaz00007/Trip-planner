import { db } from "../db/db.js";

export const createPost = (req, res) => {
  const { pname, price, description, userId, location, time } = req.body;
  const images = req.files; // Array of images

  console.log(images, "Image Path");

  // Validate the number of images
  if (!images || images.length < 3 || images.length > 5) {
    return res.status(400).json({
      error: "Please upload between 3 and 5 images.",
    });
  }

  // Values for package table insertion
  const values = [pname, price, description, userId, location, time];
  const sql = `INSERT INTO package(pname, price, description, uid, location, time) VALUES(?,?,?,?,?,?)`;

  // Insert package into the package table
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error aayo:", err);
      return res
        .status(500)
        .json({ error: "An error occurred", details: err.message });
    }

    const pid = results.insertId; // Get the ID of the inserted package
    console.log("package has been added, package ID:", pid);

    // Insert images into the package_images table
    const imageValues = images
      .slice(0, 3) // Ensure only 3 images are inserted
      .map((image) => [pid, `/images/${image.filename}`]);

    // Insert each image as a separate row
    const imageSql = `INSERT INTO image(pid, image) VALUES ?`;

    db.query(imageSql, [imageValues], (imageErr, imageResults) => {
      if (imageErr) {
        console.error("Error inserting images:", imageErr);
        return res.status(500).json({
          error: "An error occurred while inserting images",
          details: imageErr.message,
        });
      }

      console.log("Images have been added");
      res.status(200).json({
        message: "package and images have been added successfully",
        imageResults,
      });
    });
  });
};

export const getPosts = (req, res) => {
  const sql = `SELECT 
    p.*,
    GROUP_CONCAT(i.image) AS images
FROM 
    package p
LEFT JOIN 
    image i ON p.pid = i.pid
GROUP BY 
    p.pid;`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error aayo:", err);
      return res
        .status(500)
        .json({ error: "An error occurred", details: err.message });
    }

    res.status(200).json(results);
  });
};

export const getSinglePost = (req, res) => {
  const pid = req.params.id;
  // console.log(pid);
  const sql = `SELECT 
    p.*, 
    u.*,  
    COALESCE(GROUP_CONCAT(i.image), '') AS images,
    b.* 
FROM package p
LEFT JOIN image i ON p.pid = i.pid
LEFT JOIN users u ON p.uid = u.id 
LEFT JOIN bookings b ON p.pid = b.package_id  
WHERE p.pid = ?
GROUP BY p.pid, u.id, b.id; `;
  db.query(sql, [pid], (err, results) => {
    if (err) {
      console.error("Error aayo:", err);
      return res
        .status(500)
        .json({ error: "An error occurred", details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(results[0]);
  });
};

export const deletePost = (req, res) => {
  const { pid } = req.params;

  if (!pid) {
    return res.status(400).json({ error: "Package ID is required for deletion." });
  }

  // Delete images first to maintain foreign key constraints
  const deleteImageSql = `DELETE FROM image WHERE pid = ?`;

  db.query(deleteImageSql, [pid], (imageErr) => {
    if (imageErr) {
      console.error("Error deleting images:", imageErr);
      return res.status(500).json({
        error: "An error occurred while deleting images",
        details: imageErr.message,
      });
    }

    console.log("Images deleted successfully");

    // Now delete the package
    const deletePackageSql = `DELETE FROM package WHERE pid = ?`;

    db.query(deletePackageSql, [pid], (packageErr, results) => {
      if (packageErr) {
        console.error("Error deleting package:", packageErr);
        return res.status(500).json({
          error: "An error occurred while deleting the package",
          details: packageErr.message,
        });
      }

      console.log("Package deleted successfully");
      res.status(200).json({ message: "Package and associated images deleted successfully" });
    });
  });
};


export const updatePost = (req, res) => {
  const { pid } = req.params;
  const { pname, price, description, location, time } = req.body;
  const images = req.files; // Array of new images (if updated)

  console.log(images, "Updated Image Path");

  // Validate if pid is provided
  if (!pid) {
    return res
      .status(400)
      .json({ error: "Package ID is required for update." });
  }

  // SQL query to update the package details
  const updateSql = `UPDATE package SET pname = ?, price = ?, description = ?,  location = ?, time = ? WHERE pid = ?`;
  const values = [pname, price, description, location, time, pid];

  db.query(updateSql, values, (err, results) => {
    if (err) {
      console.error("Error updating package:", err);
      return res
        .status(500)
        .json({ error: "An error occurred", details: err.message });
    }

    console.log("Package has been updated");

    if (images && images.length > 0) {
      // Delete existing images before inserting new ones
      const deleteImageSql = `DELETE FROM image WHERE pid = ?`;
      db.query(deleteImageSql, [pid], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting old images:", deleteErr);
          return res.status(500).json({
            error: "An error occurred while deleting old images",
            details: deleteErr.message,
          });
        }

        // Insert new images (ensuring 3-5 images)
        if (images.length < 3 || images.length > 5) {
          return res
            .status(400)
            .json({ error: "Please upload between 3 and 5 images." });
        }

        const imageValues = images
          .slice(0, 3) // Insert only 3 images
          .map((image) => [pid, `/images/${image.filename}`]);

        const insertImageSql = `INSERT INTO image(pid, image) VALUES ?`;
        db.query(insertImageSql, [imageValues], (imageErr, imageResults) => {
          if (imageErr) {
            console.error("Error inserting images:", imageErr);
            return res.status(500).json({
              error: "An error occurred while inserting images",
              details: imageErr.message,
            });
          }

          console.log("Images have been updated");
          res.status(200).json({
            message: "Package and images have been updated successfully",
            imageResults,
          });
        });
      });
    } else {
      res.status(200).json({
        message:
          "Package has been updated successfully without changing images",
      });
    }
  });
};
