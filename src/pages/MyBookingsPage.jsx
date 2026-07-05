import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

import {
  getMyBookings,
  cancelBooking,
} from "../api/bookingApi";
import { tourImageUrl } from "../utils/imageUrl";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  function isBookingCompleted(booking) {
    if (!booking.endDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingEndDate = new Date(booking.endDate);
    bookingEndDate.setHours(0, 0, 0, 0);

    return bookingEndDate < today;
  }

  async function handleCancelBooking(id) {
    try {
      await cancelBooking(id);

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== id)
      );

      alert("Booking cancelled");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="p-10 text-white">
          Loading bookings...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-10 py-16 text-white">
        <h1 className="mb-12 text-5xl font-bold text-green-400">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-slate-300">
            You have no bookings yet.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const tour = booking.tour;
              const isCompleted = isBookingCompleted(booking);

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl bg-slate-900"
                >
                  <img
                    src={tourImageUrl(tour.imageCover)}
                    alt={tour.name}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-6">
                    <h2 className="mb-3 text-2xl font-bold">
                      {tour.name}
                    </h2>

                    <p className="mb-4 text-slate-300">
                      {tour.summary}
                    </p>

                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-green-400">
                        ₹{booking.price}
                      </span>

                      <span>
                        ⭐ {tour.ratingsAverage}
                      </span>
                    </div>

                    <div className="mb-3 text-sm text-slate-400">
                      {tour.duration} days •{" "}
                      {tour.difficulty}
                    </div>

                    {isCompleted && (
                      <div className="mb-4 inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                        Completed
                      </div>
                    )}

                    {booking.startDate &&
                      booking.endDate && (
                        <div className="mb-6 text-sm text-slate-300">
                          {new Date(
                            booking.startDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            booking.endDate
                          ).toLocaleDateString()}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/tour/${tour.slug}`}
                        className="inline-block rounded-full bg-green-500 px-5 py-2 font-semibold"
                      >
                        View Tour
                      </Link>

                      {isCompleted &&
                        (booking.hasReviewed ? (
                          <Link
                            to={`/tour/${tour.slug}#reviews`}
                            className="inline-block rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900"
                          >
                            Manage Review
                          </Link>
                        ) : (
                          <Link
                            to={`/write-review/${tour._id}`}
                            className="inline-block rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900"
                          >
                            Write Review
                          </Link>
                        ))}

                      {!isCompleted && (
                        <button
                          onClick={() =>
                            handleCancelBooking(
                              booking._id
                            )
                          }
                          className="rounded-full bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default MyBookingsPage;