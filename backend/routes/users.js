const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../Db/database");


// Register a new user
router.post(
  "/register",
  [
    body("username").isLength({ min: 1 }),
    body("password").isLength({ min: 1 }),
    body("email").isEmail(),
  ],
  async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, email } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, hashedPassword, email]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// User login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
    
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username, 
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );

        console.log(token, user.username)
        
        res.json({ token, username: user.username }); 
      } else {
        res.status(401).send("Authentication failed");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
