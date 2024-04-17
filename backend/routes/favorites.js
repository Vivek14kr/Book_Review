const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth"); 
const pool = require("../Db/database"); 

// Add a book to favorites
router.post("/add", authenticateToken, async (req, res) => {
  const { userId } = req.user; 
  const { bookId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO favorites (user_id, book_id) VALUES ($1, $2) RETURNING *",
      [userId, bookId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
    
      res.status(409).json({ error: "This book is already a favorite." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Remove a book from favorites
router.delete("/remove", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { bookId } = req.body;

  try {
    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND book_id = $2 RETURNING *",
      [userId, bookId]
    );
    if (result.rows.length) {
      res.status(200).json({ message: "Book removed from favorites." });
    } else {
      res.status(404).json({ error: "Favorite not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all favorites for a user
router.get("/list", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      "SELECT books.* FROM favorites JOIN books ON favorites.book_id = books.id WHERE favorites.user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// backend route to check if a book is a favorite
router.get("/isFavorite/:bookId", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { bookId } = req.params;

  try {
    const result = await pool.query(
      "SELECT 1 FROM favorites WHERE user_id = $1 AND book_id = $2",
      [userId, bookId]
    );
    const isFavorite = result.rows.length > 0; // true if the book is a favorite
    res.json({ isFavorite }); // sending true or false
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
