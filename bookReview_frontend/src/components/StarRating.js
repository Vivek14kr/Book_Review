const StarRating = ({ rating }) => {
  // Generate an array [0, 1, 2, 3, 4] for 5 stars
  const stars = Array.from({ length: 5 }, (_, index) => index);
  return (
    <div className="flex">
      {stars.map((index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 3a1 1 0 00-.197.02l-2.25.75a1 1 0 01-.75 0L3.6 3.02A1 1 0 002.567 4L4 7.646a1 1 0 01.293.849l-.75 2.25a1 1 0 000 .75l.75 2.25a1 1 0 01-.293.849L2.567 16a1 1 0 00.533 1.98l2.25-.75a1 1 0 01.75 0l2.25.75a1 1 0 00.75 0l2.25-.75a1 1 0 01.75 0l2.25.75a1 1 0 00.75-1.98l-1.75-1.646a1 1 0 01-.293-.849l.75-2.25a1 1 0 000-.75l-.75-2.25a1 1 0 01.293-.849L17.433 4a1 1 0 00-.866-1.98l-2.25.75a1 1 0 01-.75 0l-2.25-.75A1 1 0 009.049 3z" />
        </svg>
      ))}
    </div>
  );
};
