import React, { useState } from "react";
import Link from "next/link";

const FavoriteBookList = ({ books, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(null);

  const handleRemove = async (bookId) => {
    setIsRemoving(bookId);
    await onRemove(bookId);
    setIsRemoving(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {books.map((book) => (
        <div
          key={book.id}
          className={`border p-4 transition-all duration-300 ${
            isRemoving === book.id ? "opacity-50" : ""
          }`}
        >
          <Link href={`/books/${book.id}`}>
     
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <h3 className="text-lg font-bold mt-2">{book.title}</h3>
              <p className="text-md">{book.author}</p>
         
          </Link>
          {isRemoving === book.id ? (
            <div className="flex justify-center items-center mt-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500"></div>
            </div>
          ) : (
            <button
              onClick={() => handleRemove(book.id)}
              className="mt-2 text-red-500 rounded-full p-2 hover:bg-white-500 hover:text-white transition-colors"
              aria-label="Remove from favorites"
            >
              ❌
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FavoriteBookList;
