import { useState } from "react";

import Layout from "../components/Layout";
import { forgotPassword } from "../api/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await forgotPassword(email);
      setMessage("Password reset link sent to your email!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-10 py-16 text-white">
        <h1 className="mb-8 text-4xl font-bold text-green-400">
          Forgot Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-2xl bg-slate-900 p-8"
        >
          <div>
            <label className="mb-2 block font-semibold">Email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              placeholder="you@example.com"
            />
          </div>

          {message && <p className="text-green-400">{message}</p>}

          <button
            type="submit"
            className="rounded-full bg-green-500 px-6 py-3 font-semibold"
          >
            Send reset link
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default ForgotPasswordPage;