import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";

const SearchBar = () => {
  const router = useRouter();
  const { search, page, sort, order } = router.query;

  const [input, setInput] = useState(search || "");


const debouncedSearch = debounce((query) => {
  if (query.length >= 3 || query.length === 0) {
    const queryParams = new URLSearchParams();

    queryParams.set("page", "1");
    if (sort) queryParams.set("sort", sort);
    if (order) queryParams.set("order", order);
    if (query) queryParams.set("search", query); // No need for encodeURIComponent here

    router.push({
      pathname: "/",
      search: queryParams.toString(), // Make sure to use `search` not `query` here
    });
  }
}, 300);

  useEffect(() => {
   setInput(search || "");
    return () => {
      debouncedSearch.cancel();
    };
  }, [search]);

 
  const handleSearch = (event) => {
    setInput(event.target.value);
    debouncedSearch(event.target.value);
  };

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
