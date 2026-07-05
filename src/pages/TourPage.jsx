import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import OverviewBox from "../components/OverviewBox";
import ReviewCard from "../components/ReviewCard";
import Map from "../components/Map";

import { getTour } from "../api/tourApi";

import {
  createRazorpayOrder,
  verifyPayment,
  getUnavailableDates,
} from "../api/bookingApi";

import { jwtDecode } from "jwt-decode";
import { tourImageUrl } from "../utils/imageUrl";

function TourPage() {
  const { slug } = useParams();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [unavailableDates, setUnavailableDates] =
    useState([]);

  const [fullDates, setFullDates] =
    useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];

    let currentUser = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);

        currentUser = {
          _id: decoded.id,
          id: decoded.id,
        };
      } catch (err) {
        console.error(err);
      }
    }

  useEffect(() => {
    async function loadTour() {
      try {
        const data = await getTour(slug);

        setTour(data);

        const availabilityData = await getUnavailableDates(data._id);

        setUnavailableDates(
          availabilityData.unavailableDates
        );

        setFullDates(
          availabilityData.fullDates
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTour();
  }, [slug]);

  useEffect(() => {
    if (tour) {
      document.title = `${tour.name} | Natours`;
    }
  }, [tour]);

  function formatDate(date) {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function isUnavailable(date) {
    const dateString = formatDate(date);

    return Array.isArray(unavailableDates)
      ? unavailableDates.includes(dateString)
      : false;
  }

  function isFull(date) {
    const dateString = formatDate(date);

    return Array.isArray(fullDates)
      ? fullDates.includes(dateString)
      : false;
  }

  function handleDateClick(date) {
    if (isUnavailable(date)) return;

    setStartDate(formatDate(date));
  }

  function getCalendarDays() {
    const year = calendarMonth.getFullYear();

    const month = calendarMonth.getMonth();

    const today = new Date();

    const tomorrow = new Date();

    tomorrow.setDate(today.getDate() + 1);

    tomorrow.setHours(0, 0, 0, 0);

    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDay = 1;

    if (
      month === tomorrow.getMonth() &&
      year === tomorrow.getFullYear()
    ) {
      startDay = tomorrow.getDate();
    }

    const actualStartDate = new Date(year, month, startDay);

    const startWeekDay = actualStartDate.getDay();

    const days = [];

    for (let i = 0; i < startWeekDay; i++) {
      days.push(null);
    }

    for (
      let day = startDay;
      day <= lastDayOfMonth.getDate();
      day++
    ) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  function previousMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    );
  }

  function canGoToPreviousMonth() {
    const today = new Date();

    const minMonth = today.getMonth();

    const minYear = today.getFullYear();

    return (
      calendarMonth.getFullYear() > minYear ||
      calendarMonth.getMonth() > minMonth
    );
  }

  async function handleBooking() {
    if (!startDate) {
      alert("Please select an available start date");

      return;
    }

    try {
      const data = await createRazorpayOrder(
        tour._id,
        startDate
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "Natours",

        description: tour.name,

        image: "/logo.png",

        order_id: data.order.id,

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              tourId: tour._id,

              startDate,
            });

            alert("Booking successful!");
          } catch (err) {
            console.error(err);

            alert(
              err?.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        prefill: {
          name: "User",

          email: "user@example.com",
        },

        theme: {
          color: "#22c55e",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="p-10 text-white">Loading tour...</p>
      </Layout>
    );
  }

  if (!tour) {
    return (
      <Layout>
        <p className="p-10 text-red-400">Tour not found</p>
      </Layout>
    );
  }

  const calendarDays = getCalendarDays();

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-10 py-16 text-white">
        <h1 className="mb-6 text-5xl font-bold text-green-400">
          {tour.name}
        </h1>

        <p className="mb-8 text-lg text-slate-300">
          {tour.description}
        </p>

        <div className="grid gap-6 rounded-2xl bg-slate-900 p-8">
          <img
            src={tourImageUrl(tour.imageCover)}
            alt={tour.name}
            className="h-[400px] w-full rounded-2xl object-cover"
          />

          <div>
            <span className="font-bold text-green-400">
              Price:
            </span>{" "}
            ${tour.price}
          </div>

          <div>
            <span className="font-bold text-green-400">
              Summary:
            </span>{" "}
            {tour.summary}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-800 p-6">
            <h2 className="mb-4 text-2xl font-bold text-green-400">
              Select Start Date
            </h2>

            <div className="mb-4 flex items-center justify-between">
              {canGoToPreviousMonth() ? (
                <button
                  type="button"
                  onClick={previousMonth}
                  className="rounded bg-slate-700 px-3 py-1"
                >
                  ←
                </button>
              ) : (
                <div></div>
              )}

              <p className="font-semibold">
                {calendarMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <button
                type="button"
                onClick={nextMonth}
                className="rounded bg-slate-700 px-3 py-1"
              >
                →
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-2 text-center text-sm text-slate-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index}></div>;
                }

                const dateString = formatDate(date);

                const disabled = isUnavailable(date);

                const full = isFull(date);
                const selected = startDate === dateString;

                return (
                  <button
                    key={dateString}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDateClick(date)}
                    className={`rounded-lg p-3 text-sm font-semibold ${
                      selected
                        ? "bg-green-500 text-white"
                        : full
                        ? "cursor-not-allowed bg-red-900 text-red-300"
                        : disabled
                        ? "cursor-not-allowed bg-slate-700 text-slate-500"
                        : "bg-slate-900 text-white hover:bg-green-600"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-900"></span>
                Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-green-500"></span>
                Selected
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-900"></span>
                Group full
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-700"></span>
                You already have a trip
              </span>
            </div>

            {startDate && (
              <p className="mt-4 text-green-400">
                Selected start date: {startDate}
              </p>
            )}
          </div>

          <button
            onClick={handleBooking}
            className="w-fit rounded-full bg-green-500 px-6 py-3 font-semibold"
          >
            Book Tour
          </button>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <OverviewBox
              label="Difficulty"
              text={tour.difficulty}
              icon="📈"
            />

            <OverviewBox
              label="Duration"
              text={`${tour.duration} days`}
              icon="🕒"
            />

            <OverviewBox
              label="Group Size"
              text={`${tour.maxGroupSize} people`}
              icon="👥"
            />

            <OverviewBox
              label="Rating"
              text={`${tour.ratingsAverage} / 5`}
              icon="⭐"
            />
          </div>

          <div className="mt-10">
            <h2
              id="reviews"
              className="mb-4 text-3xl font-bold text-green-400"
            >
              Reviews
            </h2>

            <div className="grid gap-4">
              {tour.reviews?.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>

          {tour.images?.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {tour.images.map((img) => (
                <img
                  key={img}
                  src={tourImageUrl(img)}
                  alt={tour.name}
                  className="h-56 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <Map locations={tour.locations} />
        </div>
      </section>
    </Layout>
  );
}

export default TourPage;