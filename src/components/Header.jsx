import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { logout, getMe } from "../api/authApi";
import { userImageUrl } from "../utils/imageUrl";

function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

      setMenuOpen(false);
      alert("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error logging out");
    }
  }

  return (
    <header className="bg-slate-900 px-6 py-4 text-white md:px-10 md:py-6">
      <div className="flex items-center justify-between">
        <nav className="hidden md:block">
          <Link to="/" className="font-medium hover:text-green-400">
            All Tours
          </Link>
        </nav>

        <Link to="/" className="text-2xl font-bold text-green-400">
          Natours
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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
                  src={userImageUrl(user?.photo || "default.jpg")}
                  alt={user?.name || "User"}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-green-400"
                />

                <span className="mt-1 text-sm font-medium">
                  {user?.name}
                </span>
              </Link>

              <Link to="/my-bookings" className="hover:text-green-400">
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

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col items-center justify-center gap-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="mt-4 flex flex-col gap-4 border-t border-slate-700 pt-4 md:hidden">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="font-medium hover:text-green-400"
          >
            All Tours
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="w-fit rounded-full border border-white px-5 py-2 hover:bg-white hover:text-slate-900"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/me"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 hover:text-green-400"
              >
                <img
                  src={userImageUrl(user?.photo || "default.jpg")}
                  alt={user?.name || "User"}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-green-400"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>

              <Link
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className="hover:text-green-400"
              >
                My Bookings
              </Link>

              <button
                onClick={handleLogout}
                className="w-fit rounded-full border border-red-400 px-5 py-2 text-red-400 hover:bg-red-400 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;