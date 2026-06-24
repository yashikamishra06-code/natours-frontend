import api from "./api";

export async function createReview(tourId, reviewData) {
  const res = await api.post(`/tours/${tourId}/reviews`, reviewData);
  return res.data;
}

export async function updateReview(reviewId, reviewData) {
  const res = await api.patch(`/reviews/${reviewId}`, reviewData);
  return res.data;
}

export async function deleteReview(reviewId) {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
}