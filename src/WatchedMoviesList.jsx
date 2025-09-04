import { useEffect, useState } from "react";
import WatchedMovie from "./WatchedMovie";
import RecommendedMoviesGrid from "./RecommendedMoviesGrid";

function getRandomMovieId(watched) {
	if (!watched || watched.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * watched.length);
	return watched[randomIndex].imdbID;
}

export default function WatchedMoviesList({
	watched,
	onDeleteWatched,
	handleSelectMovie,
	onSelectRecommended,
	recommendedMovies = [],
}) {
	const [similarMovies, setSimilarMovies] = useState([]);

	useEffect(() => {
		async function fetchSimilar() {
			// This check is important because getRandomMovieId will be null if watched is empty
			if (watched.length === 0) {
				setSimilarMovies([]); // Clear similar movies if watched list is empty
				return;
			}

			const randomId = getRandomMovieId(watched);
			if (!randomId) return;

			try {
				// We need to find the TMDB id from the IMDb ID
				const resFind = await fetch(
					`https://api.themoviedb.org/3/find/${randomId}?api_key=911f5b3092f6e66faf04d634cb0005fc&external_source=imdb_id`
				);
				const findData = await resFind.json();
				const tmdbId = findData.movie_results?.[0]?.id;
				if (!tmdbId) return;

				const res = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=911f5b3092f6e66faf04d634cb0005fc`
				);
				const data = await res.json();

				const normalized = (data.results || []).map((m) => ({
					// Normalize data shape to be consistent
					imdbID: m.id.toString(),
					Title: m.title,
					Poster: m.poster_path
						? `https://image.tmdb.org/t/p/w300${m.poster_path}`
						: null,
				}));

				setSimilarMovies(normalized);
			} catch (err) {
				console.error("Error fetching similar movies:", err);
			}
		}

		fetchSimilar();
		// ✅ BUG FIX: Add `watched` as a dependency.
		// This ensures the effect re-runs whenever the watched list changes.
	}, [watched]);

	return (
		<div className="flex flex-col gap-6">
			{/* Watched Movies Section - always visible */}
			<div>
				<ul className="backdrop-blur-md bg-slate-900/90 rounded-xl shadow-lg p-4 flex flex-col gap-3">
					{watched.map((movie) => (
						<WatchedMovie
							key={movie.imdbID}
							movie={movie}
							onDeleteWatched={onDeleteWatched}
							onSelectMovie={handleSelectMovie}
						/>
					))}
					{watched.length === 0 && (
						<p className="text-slate-400">No movies watched yet.</p>
					)}
				</ul>
			</div>

			{/* ✅ SOLUTION: Recommended Section - now outside the old logic, so it's always visible */}
			<div>
				<h2 className="text-xl font-semibold text-indigo-400 mb-3">
					Recommended For You
				</h2>
				<RecommendedMoviesGrid
					// Use similar movies if available, otherwise fall back to general recommendations
					movies={similarMovies.length > 0 ? similarMovies : recommendedMovies}
					onSelect={onSelectRecommended}
				/>
			</div>
		</div>
	);
}
