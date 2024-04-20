import React, { useState } from "react";
import { useRouter } from "next/router";

const SortDropdown = ({ onChangeSort }) => {
  const router = useRouter();
  const { sort = "id", order = "asc" } = router.query;

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const currentValue = sort !== "id" ? `${sort} ${order}` : "";

  return (
    <div className="w-full flex justify-end my-4 px-4 md:px-0">
      <div className="w-full md:w-64 relative">
        <select
          id="sort"
          value={currentValue}
          onChange={onChangeSort}
          onClick={toggleDropdown}
          onBlur={() => setDropdownOpen(false)}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out"
        >
          <option value="" disabled>
            Sort By
          </option>
          <option value="title asc">Title (A-Z)</option>
          <option value="title desc">Title (Z-A)</option>
          <option value="author asc">Author (A-Z)</option>
          <option value="author desc">Author (Z-A)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className={`fill-current h-4 w-4 transform transition-transform ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
