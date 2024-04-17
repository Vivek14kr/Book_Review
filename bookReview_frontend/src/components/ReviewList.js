import React from "react";
import Avatar from "boring-avatars";

// Utility function to render stars based on rating
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? "text-yellow-500" : "text-gray-300"}
      >
        {i <= rating ? "★" : "☆"}
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

const ReviewList = ({ reviews }) => (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-gray-900">Reviews:</h3>
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review.id} className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex items-start">
            <Avatar
              size={40}
              name={review.username || "Anonymous"}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {review.username || "Anonymous"}
                </span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No reviews yet.</p>
    )}
  </div>
);

export default ReviewList;
