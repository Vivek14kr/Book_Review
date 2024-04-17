// pages/books/[id].js
import BookDetail from "@/components/BookDetail";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const resBook = await fetch(`http://localhost:3000/api/books/${id}`);
  const book = await resBook.json();

  const resReviews = await fetch(
    `http://localhost:3000/api/books/${id}/reviews`
  );
  const reviews = await resReviews.json();

  return { props: { book, reviews } };
}

const BookDetailsPage = ({ book, reviews }) => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <BookDetail book={book} />
      <ReviewForm bookId={book.id} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default BookDetailsPage;
