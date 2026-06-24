import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { login } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await login(email, password);

      console.log(data);

      alert("Logged in successfully!");

      navigate("/");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Login failed"
      );
    }
  }

  return (
    <Layout>
      <section className="flex justify-center px-10 py-20">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 p-10">
          <h1 className="mb-8 text-5xl font-bold text-green-400">
            Log into your account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-white">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-white">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <p className="mt-3 text-right">
              <Link
                to="/forgotPassword"
                className="text-green-400 hover:underline"
              >
                Forgot password?
              </Link>
            </p>

            <button
              type="submit"
              className="w-full rounded-full bg-green-500 py-3 font-semibold text-white"
            >
              Login
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}

export default LoginPage;