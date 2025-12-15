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
	const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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
					`https://api.themoviedb.org/3/find/${randomId}?api_key=${API_KEY}&external_source=imdb_id`
				);
				const findData = await resFind.json();
				const tmdbId = findData.movie_results?.[0]?.id;
				if (!tmdbId) return;

				const res = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=${API_KEY}`
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
	}, [watched?.length]);

	return (
		<div className="flex flex-col gap-8 pb-10">
			<div>
				<h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 pl-1 flex items-center gap-2">
					<Library className="w-4 h-4" /> Your Collection
				</h3>

				<ul className="flex flex-col gap-2">
					<AnimatePresence mode="popLayout">
						{watched?.map((movie, index) => (
							<WatchedMovie
								key={movie.imdbID ?? `${movie.Title}-${index}`}
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

			<div className="pt-4 border-t border-white/5">
				<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 mb-4 flex items-center gap-2 font-cinzel">
					<Sparkles className="w-4 h-4 text-fuchsia-400" /> Recommended For You
				</h2>

				<RecommendedMoviesGrid
					movies={
						(similarMovies?.length > 0 ? similarMovies : recommendedMovies) ||
						[]
					}
					onSelect={onSelectRecommended}
					limit={6}
				/>
			</div>
		</div>
	);
}
