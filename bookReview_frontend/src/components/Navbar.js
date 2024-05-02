import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-10 bg-gray-800 ${
        isScrolled ? "shadow-md" : ""
      } transition-shadow duration-300 p-4 text-white flex justify-between items-center`}
    >
      <div className="flex items-center">
        <Link
          className="text-white px-3 py-2 rounded-md text-sm font-medium mr-4"
          href="/"
        >
          Home
        </Link>
        {user && (
          <Link
            className="text-white px-3 py-2 rounded-md text-sm font-medium mr-4"
            href="/my-favourites"
          >
            Favorite
          </Link>
        )}
      </div>
      {user ? (
        <div className="flex items-center">
          <span className="text-sm mr-4 hidden sm:inline">
            Hello, {user.username}
          </span>
          <button
            onClick={logout}
            className="px-3 py-2 bg-gray-700 rounded-md text-sm font-medium whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex">
          <Link
            className="text-white px-3 py-2 rounded-md text-sm font-medium mr-4"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="text-white px-3 py-2 rounded-md text-sm font-medium"
            href="/sign-up"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
