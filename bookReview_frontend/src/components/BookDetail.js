import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@/hooks/useAuth";


const BookDetail = ({ book }) => {
  const { isAuthenticated } = useAuth(); 
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { id } = router.query;

 useEffect(() => {
   if (user) {
     checkFavorite();
   }
 }, [id, user]);

 //check
 const checkFavorite = async () => {
   const response = await fetch(
     `http://localhost:3000/api/favorites/isFavorite/${id}`,
     {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
       },
     }
   );
   const data = await response.json();
   setIsFavorite(data.isFavorite);
 };

const toggleFavorite = async () => {
  if (!user) {
    router.push("/login"); 
    return;
  }

  const method = isFavorite ? "DELETE" : "POST";
  const endpoint = isFavorite ? "remove" : "add";
  const response = await fetch(
    `http://localhost:3000/api/favorites/${endpoint}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookId: id }),
    }
  );

  if (response.ok) {
    setIsFavorite(!isFavorite);
  }
};

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg p-6 mt-8">
      <div className="flex flex-col md:flex-row">
        <img
          src={book.cover_image_url || "/no-image.png"}
          alt={book.title}
          className="w-48 h-auto rounded-lg shadow-md"
        />

        <div className="mt-4 md:mt-0 md:ml-6">
          <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{book.author}</p>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Description:</h3>
            <p className="text-gray-600 mt-1">{book.description}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Genre:</h3>
            <p className="text-gray-600">{book.genre}</p>
          </div>
        </div>
      </div>
      {isAuthenticated && (
        <button
          onClick={toggleFavorite}
          className={`mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            isFavorite
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-400 hover:bg-gray-300"
          }`}
          disabled={!user}
        >
          {isFavorite ? "♥" : "♡"} 
        </button>
      )}
    </div>
  );
}

export default BookDetail;
