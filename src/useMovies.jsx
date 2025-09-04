import { useState, useEffect } from "react";

export default function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		async function fetchMovies() {
			try {
				setIsLoading(true);
				setError("");

				const res = await fetch(
					`https://api.themoviedb.org/3/search/movie?api_key=911f5b3092f6e66faf04d634cb0005fc&query=${encodeURIComponent(
						query
					)}`,
					{ signal: controller.signal } // Add the abort signal here
				);

				if (!res.ok)
					throw new Error("Something went wrong with fetching movies");

				const data = await res.json();
				if (!data.results || data.results.length === 0) {
					throw new Error("Movie not found");
				}

				const normalized = data.results.slice(0, 10).map((m) => ({
					// The rest of the app expects 'imdbID', 'Title', 'Year', 'Poster'.
					imdbID: m.id.toString(), // Use TMDB ID as the unique key
					Title: m.title,
					Year: m.release_date ? m.release_date.split("-")[0] : "—",
					Poster: m.poster_path
						? `https://image.tmdb.org/t/p/w300${m.poster_path}`
						: null,
				}));

				setMovies(normalized);
				setError(""); // Clear previous errors on success
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		}

		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}

		// It's good practice to also have a handleCloseMovie equivalent here
		// to clear previous results when the search bar is cleared.
		// For now, the existing logic handles this well.

		const timeoutId = setTimeout(fetchMovies, 300);

		return () => {
			clearTimeout(timeoutId);
			controller.abort();
		};
	}, [query]);

	return { movies, isLoading, error };
}
