const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
 // Import pool from your main file or create a new one
const authenticateToken = require("../middleware/auth");
const pool = require("../Db/database");



// List books with optional pagination and sorting

router.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "id",
    order = "asc",
    search = "",
  } = req.query;
  const offset = (page - 1) * limit;
  const validSorts = ["id", "title", "author", "genre", "average_rating"];
  const sortColumn = validSorts.includes(sort) ? sort : "id";

  const searchConditions = [];
  if (search) {
    const searchPattern = `%${search}%`;
    searchConditions.push(`books.title ILIKE '${searchPattern}'`);
    searchConditions.push(`books.author ILIKE '${searchPattern}'`);
    searchConditions.push(`books.genre ILIKE '${searchPattern}'`);
  }

  const whereClause =
    searchConditions.length > 0 ? `WHERE ${searchConditions.join(" OR ")}` : "";

  try {
    const booksQuery = `
      SELECT books.*, COALESCE(AVG(reviews.rating), 0) AS average_rating
      FROM books
      LEFT JOIN reviews ON reviews.book_id = books.id
      ${whereClause}
      GROUP BY books.id
      ORDER BY ${sortColumn} ${order}
      LIMIT $1 OFFSET $2
    `;

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

  const { query } = req.query;

  console.log(query, " : query")

  try {
  
    const searchQuery = `
      SELECT * FROM books
      WHERE 
        title ILIKE $1 OR 
        author ILIKE $1 OR 
        genre ILIKE $1
    `;

 
    const searchValues = [`%${query}%`];


    const result = await pool.query(searchQuery, searchValues);

  
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
    const { id } = req.params; 
    const { rating, comment } = req.body;
    console.log(req.user, " line 119")
    const user_id = req.user.userId; 

    try {
   
      const existingReview = await pool.query(
        "SELECT id FROM reviews WHERE book_id = $1 AND user_id = $2",
        [id, user_id]
      );

      if (existingReview.rows.length > 0) {
    
        return res
          .status(400)
          .json({ message: "You have already reviewed this book." });
      }


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



router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params; 

  try {
   
   const result = await pool.query(
     `SELECT reviews.*, users.username
       FROM reviews
       INNER JOIN users ON users.id = reviews.user_id
       WHERE reviews.book_id = $1
       ORDER BY reviews.id DESC`, 
     [id]
   );

    if (result.rows.length > 0) {
   
  res.json(
    result.rows.map((review) => ({
      ...review,
      username: review.username || "Anonymous", 
    }))
  );
    } else {

      res.status(404).json({ message: "No reviews found for this book." });
    }
  } catch (err) {
 
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});



module.exports = router;
