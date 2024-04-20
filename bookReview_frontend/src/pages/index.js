import React from "react";
import SortDropdown from "@/components/SortDropDown"; // make sure to import your SortDropdown component

import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "id",
    order = "asc",
  } = context.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    // Make a fetch call with additional sorting parameters
    const res = await fetch(
      `https://shy-teal-abalone-robe.cyclic.app/api/books?page=${pageNumber}&limit=${limitNumber}&search=${encodeURIComponent(
        search
      )}&sort=${sort}&order=${order}`
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
        sort,
        order,
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

const Home = ({ books, page, totalPages, error, sort, order }) => {
  const router = useRouter();

  const handleSortChange = (event) => {
    const [newSort, newOrder] = event.target.value.split(" ");
    // Redirect or push a new URL with updated query parameters
    router.push({
      pathname: "/",
      query: { page, sort: newSort, order: newOrder },
    });
  };
  return (
    <div>
      <SearchBar />
      <SortDropdown onChangeSort={handleSortChange} />
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
