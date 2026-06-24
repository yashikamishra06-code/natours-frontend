import api from "./api";

export async function login(email, password) {
  const res = await api.post("/users/login", {
    email,
    password,
  });
  return res.data;
}

export async function logout() {
  const res = await api.get("/users/logout");
  return res.data;
}

export async function updateSettings(data, type) {
  const url =
    type === "password"
      ? "/users/updatePassword"
      : "/users/updateMe";
  const res = await api.patch(url, data);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}
export async function signup(name, email, password, passwordConfirm) {
  const res = await api.post("/users/signUp", {
    name,
    email,
    password,
    passwordConfirm,
  });

  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post("/users/forgotPassword", { email });
  return res.data;
}
export async function resetPassword(token, password, passwordConfirm) {
  const res = await api.patch(`/users/resetPassword/${token}`, {
    password,
    passwordConfirm,
  });

  return res.data;
}
