import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { signup } from "../api/authApi";

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await signup(name, email, password, passwordConfirm);

      setMessage(
        "Account created! We've sent a verification link to your email — please check your inbox (and spam/junk folder) and click the link to activate your account before logging in."
      );
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-10 py-16 text-white">
        <h1 className="mb-8 text-4xl font-bold text-green-400">
          Create your account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-2xl bg-slate-900 p-8"
        >
          <div>
            <label className="mb-2 block font-semibold">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              placeholder="Your name"
            />
          </div>

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

          <div>
            <label className="mb-2 block font-semibold">Password</label>
            <input
              type="password"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength="8"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-3 outline-none"
              placeholder="••••••••"
            />
          </div>

          {message && <p className="text-green-400">{message}</p>}

          <button
            type="submit"
            className="rounded-full bg-green-500 px-6 py-3 font-semibold"
          >
            Sign Up
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default SignupPage;