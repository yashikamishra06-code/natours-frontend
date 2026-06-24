import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { resetPassword } from "../api/authApi";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await resetPassword(token, password, passwordConfirm);

      setMessage("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Password reset failed");
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-10 py-16 text-white">
        <h1 className="mb-8 text-4xl font-bold text-green-400">
          Reset Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-2xl bg-slate-900 p-8"
        >
          <div>
            <label className="mb-2 block font-semibold">New Password</label>
            <input
              type="password"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength="8"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
            />
          </div>

          {message && <p className="text-green-400">{message}</p>}

          <button
            type="submit"
            className="rounded-full bg-green-500 px-6 py-3 font-semibold"
          >
            Reset Password
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default ResetPasswordPage;