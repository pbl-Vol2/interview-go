import React from "react";

const StarRating = ({ rating }) => {
  const MAX_RATING = 5;
  const validRating = Math.min(Math.max(rating, 0), MAX_RATING);
  const filledStars = Math.floor(validRating);
  const emptyStars = MAX_RATING - filledStars;

  return (
    <div className="flex items-center">
      {[...Array(filledStars)].map((_, index) => (
        <svg
          key={index}
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.244 3.841a1 1 0 00.95.69h4.041c.969 0 1.371 1.24.588 1.81l-3.274 2.373a1 1 0 00-.364 1.118l1.244 3.841c.3.921-.755 1.688-1.54 1.118l-3.274-2.373a1 1 0 00-1.176 0l-3.274 2.373c-.784.57-1.84-.197-1.54-1.118l1.244-3.841a1 1 0 00-.364-1.118L2.23 9.268c-.784-.57-.381-1.81.588-1.81h4.041a1 1 0 00.95-.69L9.049 2.927z"></path>
        </svg>
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <svg
          key={index}
          className="w-6 h-6 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.244 3.841a1 1 0 00.95.69h4.041c.969 0 1.371 1.24.588 1.81l-3.274 2.373a1 1 0 00-.364 1.118l1.244 3.841c.3.921-.755 1.688-1.54 1.118l-3.274-2.373a1 1 0 00-1.176 0l-3.274 2.373c-.784.57-1.84-.197-1.54-1.118l1.244-3.841a1 1 0 00-.364-1.118L2.23 9.268c-.784-.57-.381-1.81.588-1.81h4.041a1 1 0 00.95-.69L9.049 2.927z"></path>
        </svg>
      ))}
      <span className="ml-2 text-gray-600">{rating}</span>
    </div>
  );
};

export default StarRating;
