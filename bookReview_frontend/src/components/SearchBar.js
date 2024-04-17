import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { debounce } from "lodash";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

 
  const debouncedSearch = debounce((query) => {
    if (query.length === 0) {
      router.push(`/`);
    } else if (query.length > 2) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    }
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); 
    };
  }, []);

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
