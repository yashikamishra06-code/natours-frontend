import api from "./api";

export async function createRazorpayOrder(
  tourId,
  startDate
) {
  const res = await api.post(
    `/bookings/checkout-session/${tourId}`,
    {
      startDate,
    }
  );

  return res.data;
}

export async function verifyPayment(data) {
  const res = await api.post(
    "/bookings/verify-payment",
    data
  );

  return res.data;
}

export async function getUnavailableDates(tourId) {
  const res = await api.get(
    `/bookings/unavailable-dates/${tourId}`
  );

  return res.data.data;
}

export async function getMyBookings() {
  const res = await api.get("/bookings/my-bookings");

  return res.data.data.bookings;
}

export async function cancelBooking(bookingId) {
  const res = await api.patch(
    `/bookings/cancel/${bookingId}`
  );

  return res.data;
}