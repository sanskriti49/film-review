// import { useEffect, useState } from "react";
// import WatchedMovie from "./WatchedMovie";
// import RecommendedMoviesGrid from "./RecommendedMoviesGrid";

// function getRandomMovieId(watched) {
// 	if (!watched || watched.length === 0) return null;
// 	const randomIndex = Math.floor(Math.random() * watched.length);
// 	return watched[randomIndex].imdbID;
// }

// export default function WatchedMoviesList({
// 	watched,
// 	onDeleteWatched,
// 	handleSelectMovie,
// 	onSelectRecommended,
// 	recommendedMovies = [],
// }) {
// 	const [similarMovies, setSimilarMovies] = useState([]);

// 	useEffect(() => {
// 		async function fetchSimilar() {
// 			// This check is important because getRandomMovieId will be null if watched is empty
// 			if (watched.length === 0) {
// 				setSimilarMovies([]); // Clear similar movies if watched list is empty
// 				return;
// 			}

// 			const randomId = getRandomMovieId(watched);
// 			if (!randomId) return;

// 			try {
// 				// We need to find the TMDB id from the IMDb ID
// 				const resFind = await fetch(
// 					`https://api.themoviedb.org/3/find/${randomId}?api_key=911f5b3092f6e66faf04d634cb0005fc&external_source=imdb_id`
// 				);
// 				const findData = await resFind.json();
// 				const tmdbId = findData.movie_results?.[0]?.id;
// 				if (!tmdbId) return;

// 				const res = await fetch(
// 					`https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=911f5b3092f6e66faf04d634cb0005fc`
// 				);
// 				const data = await res.json();

// 				const normalized = (data.results || []).map((m) => ({
// 					// Normalize data shape to be consistent
// 					imdbID: m.id.toString(),
// 					Title: m.title,
// 					Poster: m.poster_path
// 						? `https://image.tmdb.org/t/p/w300${m.poster_path}`
// 						: null,
// 				}));

// 				setSimilarMovies(normalized);
// 			} catch (err) {
// 				console.error("Error fetching similar movies:", err);
// 			}
// 		}

// 		fetchSimilar();
// 		// ✅ BUG FIX: Add `watched` as a dependency.
// 		// This ensures the effect re-runs whenever the watched list changes.
// 	}, [watched]);

// 	return (
// 		<div className="flex flex-col gap-6">
// 			{/* Watched Movies Section - always visible */}
// 			<div>
// 				<ul className="backdrop-blur-md bg-slate-900/90 rounded-xl shadow-lg p-4 flex flex-col gap-3">
// 					{watched.map((movie) => (
// 						<WatchedMovie
// 							key={movie.imdbID}
// 							movie={movie}
// 							onDeleteWatched={onDeleteWatched}
// 							onSelectMovie={handleSelectMovie}
// 						/>
// 					))}
// 					{watched.length === 0 && (
// 						<p className="text-slate-400">No movies watched yet.</p>
// 					)}
// 				</ul>
// 			</div>

// 			<div>
// 				<h2 className="text-xl font-semibold text-indigo-400 mb-3">
// 					Recommended For You
// 				</h2>
// 				<RecommendedMoviesGrid
// 					// Use similar movies if available, otherwise fall back to general recommendations
// 					movies={similarMovies.length > 0 ? similarMovies : recommendedMovies}
// 					onSelect={onSelectRecommended}
// 				/>
// 			</div>
// 		</div>
// 	);
// }
import { useEffect, useState } from "react";
import WatchedMovie from "./WatchedMovie";
import RecommendedMoviesGrid from "./RecommendedMoviesGrid";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Library } from "lucide-react";

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
			if (watched.length === 0) {
				setSimilarMovies([]);
				return;
			}

			const randomId = getRandomMovieId(watched);
			if (!randomId) return;

			try {
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
	}, [watched]);

	return (
		<div className="flex flex-col gap-8 pb-10">
			{/* Watched Movies Section */}
			<div>
				<h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 pl-1 flex items-center gap-2">
					<Library className="w-4 h-4" /> Your Collection
				</h3>

				<ul className="flex flex-col gap-2">
					<AnimatePresence mode="popLayout">
						{watched.map((movie) => (
							<WatchedMovie
								key={movie.imdbID}
								movie={movie}
								onDeleteWatched={onDeleteWatched}
								onSelectMovie={handleSelectMovie}
							/>
						))}
					</AnimatePresence>

					{watched.length === 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-10 rounded-xl border border-dashed border-white/10 bg-white/5"
						>
							<p className="text-gray-400 text-sm">Your library is empty.</p>
							<p className="text-gray-600 text-xs mt-1">
								Start rating movies to add them here.
							</p>
						</motion.div>
					)}
				</ul>
			</div>

			{/* Recommendations Section */}
			<div className="pt-4 border-t border-white/5">
				<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 mb-4 flex items-center gap-2 font-cinzel">
					<Sparkles className="w-4 h-4 text-fuchsia-400" /> Recommended For You
				</h2>

				<RecommendedMoviesGrid
					movies={similarMovies.length > 0 ? similarMovies : recommendedMovies}
					onSelect={onSelectRecommended}
					limit={6} // Limit grid to keep UI clean
				/>
			</div>
		</div>
	);
}
