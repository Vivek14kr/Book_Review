const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
 // Import pool from your main file or create a new one
const authenticateToken = require("../middleware/auth");
const pool = require("../Db/database");



// List books with optional pagination and sorting
// Adjust your existing router.get("/") to include search logic
router.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "id",
    order = "asc",
    search = "",
  } = req.query;
  const offset = (page - 1) * limit;

  // Building the WHERE clause dynamically based on search input
  const searchConditions = [];
  if (search) {
    const searchPattern = `%${search}%`;
    searchConditions.push(`title ILIKE '${searchPattern}'`);
    searchConditions.push(`author ILIKE '${searchPattern}'`);
    searchConditions.push(`genre ILIKE '${searchPattern}'`);
  }

  const whereClause =
    searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")}` : "";

  try {
    const booksQuery = `SELECT * FROM books ${whereClause} ORDER BY ${sort} ${order} LIMIT $1 OFFSET $2`;
    const booksResult = await pool.query(booksQuery, [limit, offset]);

    const countQuery = `SELECT COUNT(*) FROM books ${whereClause}`;
    const countResult = await pool.query(countQuery);

    const totalBooks = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books: booksResult.rows,
      page: parseInt(page, 10),
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({
      error: "Failed to fetch books",
      books: [],
      page: 1,
      totalPages: 1,
    });
  }
});





// Search books
router.get("/search", async (req, res) => {
  // The search term is expected to be in the 'query' query parameter.
  const { query } = req.query;

  try {
    // Construct the SQL query to search for the term in all three columns.
    const searchQuery = `
      SELECT * FROM books
      WHERE 
        title ILIKE $1 OR 
        author ILIKE $1 OR 
        genre ILIKE $1
    `;

    // The same search term is used for title, author, and genre.
    const searchValues = [`%${query}%`];

    // Execute the query.
    const result = await pool.query(searchQuery, searchValues);

    // Respond with the search result.
    res.json(result.rows);
  } catch (err) {
    // Handle any errors that occur during the query.
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
    const { id } = req.params; // book id
    const { rating, comment } = req.body;
    console.log(req.user, " line 119")
    const user_id = req.user.userId; // Assume this comes from authentication token

    try {
      // Check if the review already exists
      const existingReview = await pool.query(
        "SELECT id FROM reviews WHERE book_id = $1 AND user_id = $2",
        [id, user_id]
      );

      if (existingReview.rows.length > 0) {
        // Review already exists
        return res
          .status(400)
          .json({ message: "You have already reviewed this book." });
      }

      // Insert the new review
      const result = await pool.query(
        "INSERT INTO reviews (book_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
        [id, user_id, rating, comment]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error posting review:", err);
      res.status(500).json({ error: err.message });
    }
  }
);


// Add a new GET route to fetch reviews for a specific book
router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params; // Get the book ID from the route parameter

  try {
    // Query the database to get all reviews for the specified book ID
   const result = await pool.query(
     `SELECT reviews.*, users.username
       FROM reviews
       INNER JOIN users ON users.id = reviews.user_id
       WHERE reviews.book_id = $1
       ORDER BY reviews.id DESC`, // Order by review ID for consistency
     [id]
   );

    if (result.rows.length > 0) {
      // If there are reviews, return them
  res.json(
    result.rows.map((review) => ({
      ...review,
      username: review.username || "Anonymous", // Use the username or 'Anonymous' if not present
    }))
  );
    } else {
      // If no reviews are found, return an empty array with a 404 status
      res.status(404).json({ message: "No reviews found for this book." });
    }
  } catch (err) {
    // Handle any database or server errors
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});



module.exports = router;
