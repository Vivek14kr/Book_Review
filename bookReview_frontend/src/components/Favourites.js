import React, { useEffect, useState } from "react";
import FavoriteBookList from "./FavouriteBookList";
import { useRouter } from "next/router";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
   const router = useRouter();

 useEffect(() => {
   const token = localStorage.getItem("token");
   if (!token) {
     // Redirect to login page if not logged in
     router.push("/login");
   } else {
     fetchFavorites(token);
   }
 }, [router]);

  const fetchFavorites = async () => {
    const response = await fetch("http://localhost:3000/api/favorites/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setFavorites(data);
    setLoading(false);
  };

  const handleRemoveFavorite = async (bookId) => {
    await fetch(`http://localhost:3000/api/favorites/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookId }),
    });
    fetchFavorites(); // Refresh the list of favorites after removing an item
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (favorites.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-700 text-lg">You have no favorites yet.</p>
          <p className="text-gray-500">
            Add some books to favorites and they will appear here!
          </p>
        </div>
      );
    }

    return (
      <FavoriteBookList books={favorites} onRemove={handleRemoveFavorite} />
    );
  };

  return <div>{renderContent()}</div>;
};

export default Favorites;
