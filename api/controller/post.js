import { db } from "../db/db.js";

export const createPost = (req, res) => {
  const { pname, price, description, userId, location } = req.body;
  const images = req.files; // Array of images

  console.log(images, "Image Path");

  // Validate the number of images
  if (!images || images.length < 3 || images.length > 5) {
    return res.status(400).json({
      error: "Please upload between 3 and 5 images.",
    });
  }

  // Values for package table insertion
  const values = [pname, price, description, userId, location];
  const sql = `INSERT INTO package(pname, price, description, uid, location) VALUES(?,?,?,?,?)`;

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
