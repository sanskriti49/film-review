import StarRating from "./StarRating";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import ReplayIcon from "@mui/icons-material/Replay";
import useKey from "./useKey";
import {
	CalendarDays,
	CheckCircle2,
	Clapperboard,
	Clock,
	Film,
	Star,
	Undo2,
} from "lucide-react";
import RecommendedMoviesGrid from "./RecommendedMoviesGrid";

export default function MovieDetails({
	watched,
	selectedId,
	onCloseMovie,
	onAddWatched,
	userRating,
	setUserRating,
	createWatchedMovie,
	setWatched,
	isMovieInList,
	findMovieInList,
	isRated,
	setIsRated,
	ratingDecisions,
	setRatingDecisions,
	onSelectRecommended, // This is for the recommended list
	recommendedMovies = [],
}) {
	const [movie, setMovie] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isClickedRetry, setIsClickedRetry] = useState(false);

	const isWatched = isMovieInList(watched, selectedId);
	const watchedMovie = findMovieInList(watched, selectedId);
	useKey("Escape", onCloseMovie);
	const isSmallList = watched.length <= 3;
	const [similarMovies, setSimilarMovies] = useState([]);

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			setError(null);

			try {
				// --- Step 1: Fetch from OMDb (Primary Source) ---
				const resOMDb = await fetch(
					`https://www.omdbapi.com/?i=${selectedId}&apikey=fdab5723`
				);
				if (!resOMDb.ok) throw new Error("Error fetching OMDb movie details");

				const omdbData = await resOMDb.json();
				if (omdbData.Response === "False")
					throw new Error("Movie not found on OMDb");

				// --- Step 2: Check if the OMDb poster is missing ---
				if (omdbData.Poster === "N/A") {
					console.log(
						"OMDb poster not found. Fetching from TMDB as fallback..."
					);

					// --- Step 3: Fetch from TMDB using the IMDb ID ---
					const resTMDB = await fetch(
						`https://api.themoviedb.org/3/find/${selectedId}?api_key=911f5b3092f6e66faf04d634cb0005fc&external_source=imdb_id`
					);
					if (!resTMDB.ok) {
						console.error("Failed to fetch from TMDB, using default poster.");
					} else {
						const tmdbFindData = await resTMDB.json();
						const tmdbMovie = tmdbFindData.movie_results?.[0];

						// --- Step 4 & 5: If found, replace the poster URL ---
						if (tmdbMovie?.poster_path) {
							const tmdbPosterUrl = `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`;
							omdbData.Poster = tmdbPosterUrl;
							console.log("Successfully replaced with TMDB poster.");
						}
					}
				}
				setMovie(omdbData);
			} catch (err) {
				setError("Failed to fetch movie details.");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		if (selectedId) {
			getMovieDetails();
		}
	}, [selectedId]);

	useEffect(() => {
		async function fetchSimilar() {
			if (!selectedId) return;

			try {
				const resFind = await fetch(
					`https://api.themoviedb.org/3/find/${selectedId}?api_key=911f5b3092f6e66faf04d634cb0005fc&external_source=imdb_id`
				);
				const findData = await resFind.json();
				const tmdbId = findData.movie_results?.[0]?.id;
				if (!tmdbId) return;

				// Step 2: Fetch similar movies
				const resSimilar = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=911f5b3092f6e66faf04d634cb0005fc`
				);
				const data = await resSimilar.json();

				const normalized = data.results.map((m) => ({
					imdbID: m.id.toString(), // TMDB id as fallback
					Title: m.title,
					Year: m.release_date ? m.release_date.split("-")[0] : "—",
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
	}, [selectedId]);

	useEffect(() => {
		if (watchedMovie) {
			setUserRating(watchedMovie.userRating);
			setIsRated(
				watchedMovie.userRating !== null && watchedMovie.userRating !== 0
			);
			setRatingDecisions(watchedMovie.countRatingDecisions || 0);
		} else {
			setUserRating(null);
			setIsRated(false);
			setRatingDecisions(0);
		}
	}, [watched, selectedId]);

	useEffect(() => {
		if (!movie?.Title) return;
		document.title = `Movie | ${movie.Title}`;
		return () => (document.title = "CineBuzz ");
	}, [movie]);

	function handleRatingChange(newRating) {
		setUserRating(newRating);
		setIsRated(true);
		setIsClickedRetry(false);

		if (isWatched) {
			const originalWatchedMovie = findMovieInList(watched, selectedId);

			const updatedMovie = {
				...originalWatchedMovie,
				userRating: newRating,
			};

			setWatched((currentWatchedList) =>
				currentWatchedList.map((m) =>
					m.imdbID === selectedId ? updatedMovie : m
				)
			);
		}
	}

	function handleAdd() {
		if (isWatched) return;
		const finalRating = userRating !== null ? userRating : 0;

		const newWatchedMovie = createWatchedMovie(movie, finalRating, 1);

		onAddWatched(newWatchedMovie);
		handleRatingChange(finalRating);
		setRatingDecisions(1);
		setIsRated(finalRating !== 0);
	}

	function handleRetry() {
		setIsClickedRetry(true);
	}

	const {
		Title: title = "N/A",
		Year: year = "N/A",
		Poster: poster = "",
		Runtime: runtime = "0 min",
		imdbRating = 0,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie || {};

	return (
		<div className="relative h-full flex flex-col text-gray-100 overflow-y-auto custom-scrollbar">
			{isLoading ? (
				<div className="absolute inset-0 flex items-center justify-center bg-[#0f0c29]">
					<BeatLoader color="#a78bfa" />
				</div>
			) : (
				<>
					{/* --- HERO HEADER --- */}
					<div className="relative w-full h-[400px] flex-shrink-0">
						{/* Back Button - Absolute & Floating */}
						<button
							onClick={onCloseMovie}
							className="cursor-pointer absolute top-4 left-4 z-50 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:-translate-x-1"
						>
							<Undo2 className="w-6 h-6" />
						</button>

						{/* Blurred Background Image */}
						<div
							className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
							style={{ backgroundImage: `url(${poster})` }}
						/>
						{/* Gradient Overlay for readability */}
						<div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-[#0f0c29]/60 to-transparent" />

						{/* Content Container */}
						<div className="absolute bottom-0 left-0 w-full p-6 flex items-end gap-6 z-10">
							<img
								className="w-32 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/10 hidden sm:block"
								src={poster}
								alt={title}
							/>
							<div className="flex flex-col gap-2 pb-2">
								<h2 className="text-3xl md:text-4xl font-bold cinzel text-white leading-tight drop-shadow-lg">
									{title}
								</h2>

								{/* Metadata Chips */}
								<div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-gray-300">
									<span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md border border-white/5 flex items-center gap-1">
										<CalendarDays className="w-3 h-3 text-indigo-400" />{" "}
										{released}
									</span>
									<span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md border border-white/5 flex items-center gap-1">
										<Clock className="w-3 h-3 text-fuchsia-400" /> {runtime}
									</span>
									<span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md border border-white/5 flex items-center gap-1">
										<Film className="w-3 h-3 text-cyan-400" /> {genre}
									</span>
								</div>

								<div className="flex items-center gap-2 mt-1">
									<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
									<span className="text-lg font-bold text-white">
										{imdbRating}
									</span>
									<span className="text-xs text-gray-400">/10 IMDb</span>
								</div>
							</div>
						</div>
					</div>

					{/* --- BODY CONTENT --- */}
					<div className="p-6 md:p-8 space-y-8 bg-[#0f0c29] flex-1">
						{/* RATING SECTION */}
						<div className="flex justify-center">
							<div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-4 w-full max-w-md shadow-inner">
								{!isWatched ? (
									<>
										<StarRating
											size="32px"
											maxRating={10}
											color="#fcc419"
											onRatingChange={handleRatingChange}
											initialRating={userRating}
										/>
										<button
											className="cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300"
											onClick={() => onAddWatched(movie)}
										>
											+ Add to Library
										</button>
									</>
								) : (
									<div className="flex flex-col items-center gap-2">
										<div className="text-emerald-400 font-medium flex items-center gap-2 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
											<CheckCircle2 className="w-5 h-5" /> Added to Library
										</div>
										<p className="text-sm text-gray-400 mt-2">
											Your rating:{" "}
											<span className="text-yellow-400 font-bold text-lg">
												{userRating}
											</span>{" "}
											/ 10
										</p>
									</div>
								)}
							</div>
						</div>

						{/* PLOT & CREDITS */}
						<div className="space-y-4">
							<h3 className="text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">
								Plot Summary
							</h3>
							<p className="text-gray-300 leading-relaxed font-light text-lg">
								{plot}
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
								<div>
									<span className="text-gray-500 text-sm uppercase tracking-wider block mb-1">
										Starring
									</span>
									<span className="text-gray-200">{actors}</span>
								</div>
								<div>
									<span className="text-gray-500 text-sm uppercase tracking-wider block mb-1">
										Director
									</span>
									<span className="text-gray-200">{director}</span>
								</div>
							</div>
						</div>

						{/* RECOMMENDATIONS */}
						{similarMovies.length > 0 && (
							<div className="pt-6">
								<h3 className="text-lg font-bold text-white border-l-4 border-fuchsia-500 pl-3 mb-4">
									More Like This
								</h3>
								<RecommendedMoviesGrid
									movies={similarMovies}
									onSelect={onSelectRecommended}
									limit={4}
								/>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
