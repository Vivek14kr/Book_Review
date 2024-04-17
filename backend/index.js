require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 3000;



app.use(bodyParser.json());


const favoritesRoutes = require("./routes/favorites"); // Ensure the path is correct

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/users");
const pool = require("./Db/database");

app.use("/books", bookRoutes);
app.use("/users", userRoutes);

app.use("/favorites", favoritesRoutes);
async function createTables() {
  const client = await pool.connect();
  try {
    // Check if the 'books' table exists
    const existsBooks = await client.query(`
      SELECT EXISTS (
        SELECT FROM 
          pg_tables
        WHERE 
          schemaname = 'public' AND 
          tablename  = 'books'
      );
    `);

    const existsUsers = await client.query(`
      SELECT EXISTS (
        SELECT FROM 
          pg_tables
        WHERE 
          schemaname = 'public' AND 
          tablename  = 'users'
      );
    `);


    if (!existsBooks.rows[0].exists && !existsUsers.rows[0].exists) {
      await client.query(`
        CREATE TABLE books (
          id SERIAL PRIMARY KEY,

          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          genre VARCHAR(100),
          description TEXT,
          cover_image_url VARCHAR(500)
        );

        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE reviews (
          id SERIAL PRIMARY KEY,
          book_id INT NOT NULL,
          user_id INT NOT NULL,
          rating INT NOT NULL,
          comment TEXT,
          FOREIGN KEY (book_id) REFERENCES books(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE favorites (
          user_id INT NOT NULL,
          book_id INT NOT NULL,
          PRIMARY KEY (user_id, book_id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (book_id) REFERENCES books(id)
        );
      `);
      
      console.log("Tables created successfully");
         await fetchAndInsertBooks(client);
    } else {
      console.log("Some tables already exist");
    }
  } catch (error) {
    console.error("Failed to create tables:", error);
  } finally {
    client.release();
  }
}



async function fetchAndInsertBooks(client) {
  const base_url = "http://openlibrary.org/subjects/";
  const genres = [
    "nonfiction",
    "fiction",
    "history",
    "biography",
    "science",
    "fantasy",
    "mystery",
    "romance",
    "finance",
    "philosophy",
    "psychology"
   

  ]; // Expandable list of genres
  const limit = 50; // Number of books to fetch per genre

  for (const genre of genres) {
    const listResponse = await fetch(`${base_url}${genre}.json?limit=${limit}`);
    const listData = await listResponse.json();

    for (const book of listData.works) {
      const detailsUrl = `https://openlibrary.org${book.key}.json`; // Fetching each book's detailed info
      const detailsResponse = await fetch(detailsUrl);
      const details = await detailsResponse.json();

      const title = details.title;

      // Extracting author names from the details; handling missing data
      const author =
        details.authors && details.authors.length > 0
          ? await Promise.all(
              details.authors.map(async (a) => {
                const authorResponse = await fetch(
                  `https://openlibrary.org${a.author.key}.json`
                );
                const authorDetails = await authorResponse.json();
                return authorDetails.name;
              })
            ).then((names) => names.join(", "))
          : "Unknown Author";

      const description = details.description
        ? typeof details.description === "string"
          ? details.description
          : details.description.value
        : "No description available";

      const cover_image_url = details.covers
        ? `http://covers.openlibrary.org/b/id/${details.covers[0]}-L.jpg`
        : "";

      await client.query(
        `
        INSERT INTO books (title, author, genre, description, cover_image_url)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [title, author, genre, description, cover_image_url]
      );
    }
  }
  console.log("Sample books data inserted successfully.");
}
// Verify database connection and setup tables before starting the server
pool
  .connect()
  .then(async (client) => {
    console.log("Database connected successfully.");
   
    client.release();
    return createTables();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

