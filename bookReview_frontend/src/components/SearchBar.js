import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";

const SearchBar = () => {
  const router = useRouter();
  const { search, page, sort, order } = router.query;

  const [input, setInput] = useState(search || "");

  // Wrap the debounced function in a useCallback hook to memoize it across re-renders
  const debouncedSearch = useCallback(
    debounce((query) => {
      const queryParams = {
        page: "1",
        ...(sort && { sort }),
        ...(order && { order }),
        ...(query && { search: query }),
      };

      router.push({
        pathname: "/",
        query: queryParams,
      });
    }, 300),
    [sort, order, router] // Dependencies should include values from router query to re-create the debounced function when they change
  );

  useEffect(() => {
    // Clean up the debounced function on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (search) {
      setInput(search);
    }
  }, [search]);

  return (
    <div className="m-8">
      <input
        type="text"
        value={input}
        onChange={handleSearch}
        className="p-2 border rounded w-full"
        placeholder="Search books by title, author, or genre..."
      />
    </div>
  );
};

export default SearchBar;
