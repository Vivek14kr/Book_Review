import React, { useState } from "react";
import BookDetail from "@/components/BookDetail";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const resBook = await fetch(`https://new-app-book-a35b9b70edee.herokuapp.com/api/books/${id}`);
  const book = await resBook.json();

  const resReviews = await fetch(
    `https://new-app-book-a35b9b70edee.herokuapp.com/api/books/${id}/reviews`
  );
  const reviews = await resReviews.json();

  return { props: { book, reviews } };
}

const BookDetailsPage = ({ book, reviews }) => {
  const [updatedReviews, setUpdatedReviews] = useState(reviews);

  const updateReviews = async () => {
    const resReviews = await fetch(
      `https://new-app-book-a35b9b70edee.herokuapp.com/api/books/${book.id}/reviews`
    );
    const updatedReviews = await resReviews.json();
    setUpdatedReviews(updatedReviews);
  };

  return (
    <div className="container mx-auto px-4 mb-16">
      <BookDetail book={book} />
      <ReviewForm bookId={book.id} updateReviews={updateReviews} />
      <ReviewList reviews={updatedReviews} />
    </div>
  );
};

export default BookDetailsPage;
