import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";

import { createReview } from "../api/reviewApi";

function WriteReviewPage() {
  const { tourId } = useParams();

  const navigate = useNavigate();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await createReview(tourId, {
        review,
        rating,
      });

      alert("Review submitted successfully!");

      navigate("/my-bookings");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-2xl px-10 py-16 text-white">
        <h1 className="mb-10 text-4xl font-bold text-green-400">
          Write Review
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-slate-900 p-8"
        >
          <div className="mb-6">
            <label className="mb-2 block font-semibold">
              Rating
            </label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="w-full rounded-lg bg-slate-800 p-3"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Great</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Average</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="mb-2 block font-semibold">
              Review
            </label>

            <textarea
              rows="6"
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
              className="w-full rounded-lg bg-slate-800 p-3"
              placeholder="Share your experience..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-green-500 px-6 py-3 font-semibold"
          >
            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default WriteReviewPage;