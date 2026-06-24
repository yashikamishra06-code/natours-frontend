import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/api";

function VerifyEmailPage() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [message, setMessage] = useState(
    "Verifying your email..."
  );

  const [error, setError] = useState(false);

  useEffect(() => {
    async function verifyEmail() {
      try {
        await api.get(`/users/verify-email/${token}`);

        setMessage(
          "Email verified successfully! Redirecting..."
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error(err);

        setError(true);

        setMessage(
          err.response?.data?.message ||
            "Verification failed"
        );
      }
    }

    verifyEmail();
  }, [token, navigate]);

  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="rounded-2xl bg-slate-900 p-10 text-center text-white shadow-2xl">
          <h1
            className={`mb-4 text-3xl font-bold ${
              error
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {error ? "Verification Failed" : "Success"}
          </h1>

          <p className="text-lg text-slate-300">
            {message}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default VerifyEmailPage;