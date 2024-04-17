// src/components/BookList.js
import React from "react";

const BookList = ({ books }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {books.map((book) => (
        <div style={{
            cursor:"pointer"
        }} key={book.id} className="border p-4">
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
          <h3 className="text-lg font-bold mt-2">{book.title}</h3>
          <p className="text-md">{book.author}</p>
          {/* Additional book details */}
        </div>
      ))}
    </div>
  );
};

export default BookList;