import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { getAllTours } from "../api/tourApi";
import { Link } from "react-router-dom";

function HomePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    async function loadTours() {
      try {
        const toursData = await getAllTours();
        setTours(toursData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  const filteredTours = useMemo(() => {
    let result = [...tours];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (tour) =>
          tour.name.toLowerCase().includes(query) ||
          tour.summary.toLowerCase().includes(query) ||
          tour.difficulty.toLowerCase().includes(query)
      );
    }

    if (difficulty !== "all") {
      result = result.filter((tour) => tour.difficulty === difficulty);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    }

    if (sortBy === "duration") {
      result.sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [tours, search, difficulty, sortBy]);

  return (
    <Layout>
      <section className="px-10 py-16">
        <h1 className="mb-10 text-center text-5xl font-bold text-green-400">
          All Tours
        </h1>

        <div className="mx-auto mb-10 grid max-w-5xl gap-4 rounded-2xl bg-slate-900 p-6 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg bg-slate-800 p-3 text-white outline-none"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg bg-slate-800 p-3 text-white outline-none"
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="difficult">Difficult</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg bg-slate-800 p-3 text-white outline-none"
          >
            <option value="default">Default sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
            <option value="duration">Shortest Duration</option>
          </select>
        </div>

        {loading && <p className="text-center text-white">Loading tours...</p>}

        {!loading && filteredTours.length === 0 && (
          <p className="text-center text-slate-300">
            No tours found.
          </p>
        )}

        {!loading && filteredTours.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <div
                key={tour._id}
                className="rounded-2xl bg-white p-6 shadow-xl"
              >
                <h2 className="mb-3 text-2xl font-bold text-slate-800">
                  {tour.name}
                </h2>

                <p className="mb-4 text-sm uppercase tracking-wide text-green-600">
                  {tour.difficulty} / {tour.duration} days
                </p>

                <p className="mb-6 text-slate-600">{tour.summary}</p>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    ₹{tour.price}
                  </span>

                  <span className="text-sm text-slate-500">
                    ⭐ {tour.ratingsAverage}
                  </span>
                </div>

                <Link
                  to={`/tour/${tour.slug}`}
                  className="mt-6 inline-block rounded-full bg-green-500 px-5 py-2 font-semibold text-white"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default HomePage;