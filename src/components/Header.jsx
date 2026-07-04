import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { logout, getMe } from "../api/authApi";

function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err) {
        // No valid session (not logged in, or token invalid/expired)
        setUser(null);
      } finally {
        setCheckedAuth(true);
      }
    }

    loadUser();
  }, []);

  // Only treat the user as logged in once we've actually confirmed it with the backend
  const isLoggedIn = checkedAuth && !!user;

  async function handleLogout() {
    try {
      await logout();

      alert("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error logging out");
    }
  }

  return (
    <header className="flex items-center justify-between bg-slate-900 px-10 py-6 text-white">
      <nav>
        <Link to="/" className="font-medium hover:text-green-400">
          All Tours
        </Link>
      </nav>

      <Link to="/" className="text-2xl font-bold text-green-400">
        Natours
      </Link>

      <nav className="flex items-center gap-6">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="hover:text-green-400">
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-full border border-white px-5 py-2 hover:bg-white hover:text-slate-900"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/me"
              className="flex flex-col items-center hover:text-green-400"
            >
              <img
                src={`http://localhost:8000/img/users/${
                  user?.photo || "default.jpg"
                }`}
                alt={user?.name || "User"}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-green-400"
              />

              <span className="mt-1 text-sm font-medium">
                {user?.name}
              </span>
            </Link>

            <Link
              to="/my-bookings"
              className="hover:text-green-400"
            >
              My Bookings
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-full border border-red-400 px-5 py-2 text-red-400 hover:bg-red-400 hover:text-white"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;