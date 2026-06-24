import api from "./api";

export async function getAllTours() {
  const res = await api.get("/tours");
  return res.data;
}

export async function getTour(slug) {
  const res = await api.get(`/tours/slug/${slug}`);
  return res.data;
}