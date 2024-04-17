const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
 // Import pool from your main file or create a new one
const authenticateToken = require("../middleware/auth");
const pool = require("../Db/database");



// List books with optional pagination and sorting
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, sort = "id", order = "asc" } = req.query;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(
      `SELECT * FROM books ORDER BY ${sort} ${order} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search books
router.get("/search", async (req, res) => {
  const { title, author, genre } = req.query;
  try {
    const query =
      "SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $2 OR genre ILIKE $3";
    const values = [`%${title}%`, `%${author}%`, `%${genre}%`];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get book details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a review
router.post(
  "/:id/reviews",
  authenticateToken,
  [
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.userId;
    try {
      const result = await pool.query(
        "INSERT INTO reviews (book_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
        [id, user_id, rating, comment]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
