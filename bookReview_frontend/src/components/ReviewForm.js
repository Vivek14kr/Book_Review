import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
const StarRating = ({ rating, onRatingChange }) => {
  const handleRating = (rate) => {
    onRatingChange(rate);
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          onClick={() => handleRating(index + 1)}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 cursor-pointer ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
        >
          <path d="M12 .587l3.668 7.429L24 9.557l-6 5.848 1.417 8.254L12 18.9l-7.417 4.759L6 15.405 0 9.557l8.332-1.541L12 .587z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewForm = ({ bookId, updateReviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  let [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const validateForm = () => {
    let tempErrors = {};
    if (!rating) {
      tempErrors.rating = "Please select a rating";
    }
    if (!comment.trim()) {
      tempErrors.comment = "Comment cannot be empty";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Prepare request data
    const formData = { rating, comment };

    try {
      setLoading(true);
      const response = await fetch(
        `https://shy-teal-abalone-robe.cyclic.app/api/books/${bookId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Reset form after successful submission
      setRating(0);
      setComment("");
      setErrors({});
      setLoading(false);
      updateReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      setLoading(false);
      setErrors({
        apiError: "Failed to submit review. Please try again later.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 mt-8"
    >
      <h3 className="text-lg font-semibold text-gray-900">Write a review:</h3>
      <div className="mt-4">
        <label htmlFor="rating" className="block text-gray-700">
          Rating:
        </label>
        <StarRating
          rating={rating}
          onRatingChange={(rate) => setRating(rate)}
        />
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="comment" className="block text-gray-700">
          Comment:
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
          placeholder="What did you think of the book?"
        ></textarea>
        {errors.comment && (
          <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
        )}
      </div>
      {errors.apiError && (
        <p className="text-red-500 text-xs mt-2">{errors.apiError}</p>
      )}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
