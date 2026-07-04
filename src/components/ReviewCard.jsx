import { useState } from "react";

import {
  updateReview,
  deleteReview,
} from "../api/reviewApi";
import { userImageUrl } from "../utils/imageUrl";

function ReviewCard({ review, currentUser, onReviewChanged }) {
  const reviewUser = review.refToUser || review.user;

  const isOwnReview =
    currentUser &&
    reviewUser &&
    currentUser.id === reviewUser._id;

  const [isEditing, setIsEditing] = useState(false);
  const [reviewText, setReviewText] = useState(review.review);
  const [rating, setRating] = useState(review.rating);

  async function handleUpdate() {
    try {
      await updateReview(review._id, {
        review: reviewText,
        rating,
      });

      review.review = reviewText;
      review.rating = rating;

      alert("Review updated");
      setIsEditing(false);

      if (onReviewChanged) onReviewChanged();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating review");
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await deleteReview(review._id);

      alert("Review deleted");

      if (onReviewChanged) onReviewChanged();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting review");
    }
  }

  return (
    <div className="rounded-2xl bg-slate-800 p-6 text-white">
      <div className="flex items-start gap-5">
        <div className="flex w-24 flex-col items-center">
          <img
            src={userImageUrl(reviewUser?.photo || "default.jpg")}
            alt={reviewUser?.name || "User"}
            className="h-16 w-16 rounded-full object-cover"
          />

          <p className="mt-2 text-center text-sm font-semibold text-slate-200">
            {reviewUser?.name || "User"}
          </p>
        </div>

        <div className="flex-1">
          {isEditing ? (
            <>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full rounded-lg bg-slate-900 p-3 text-white"
                rows="4"
              />

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="mt-3 w-full rounded-lg bg-slate-900 p-3"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Great</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Average</option>
                <option value={1}>1 - Poor</option>
              </select>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="rounded-full bg-green-500 px-4 py-2 font-semibold"
                >
                  Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-full bg-slate-600 px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-300">{review.review}</p>

              <p className="mt-4 font-semibold text-yellow-400">
                ⭐ {review.rating} / 5
              </p>

              {isOwnReview && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900"
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;