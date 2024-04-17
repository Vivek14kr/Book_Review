import React from "react";
import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";

export const getServerSideProps = async (context) => {
  const { page = 1, limit = 10, search = "" } = context.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    // Validate page number
    if (pageNumber < 1) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const res = await fetch(
      `http://localhost:3000/api/books?page=${pageNumber}&limit=${limitNumber}&search=${encodeURIComponent(
        search
      )}`
    );
    const data = await res.json();

     if (pageNumber > data.totalPages) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (!data.books || !Array.isArray(data.books) || data.books.length === 0) {
      return {
        props: {
          error: "No books found for your query.",
          books: [],
          page: 1,
          totalPages: 1,
        },
      };
    }

    return {
      props: {
        books: data.books,
        page: data.page,
        totalPages: data.totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      props: {
        error: "Failed to load the books data.",
        books: [],
        page: 1,
        totalPages: 1,
      },
    };
  }
};

const Home = ({ books, page, totalPages, error }) => {
  return (
    <div>
     
      <SearchBar />
      {error ? (
        <div className="text-red-500 text-center my-10">{error}</div>
      ) : (
        <>
          <BookList books={books} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
};

export default Home;
