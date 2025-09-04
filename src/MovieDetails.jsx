import StarRating from "./StarRating";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import ReplayIcon from "@mui/icons-material/Replay";
import useKey from "./useKey";
import { Clapperboard, Undo2 } from "lucide-react";
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

	// In MovieDetails.js

	// ... other imports and component definition ...

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			setError(null);

			try {
				// --- Step 1: Fetch from OMDb (Primary Source) ---
				const resOMDb = await fetch(
					`http://www.omdbapi.com/?i=${selectedId}&apikey=fdab5723`
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
		return () => (document.title = "CineTrack ");
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
		<div className="relative text-white text-base">
			{isLoading ? (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50">
					<BeatLoader color="#7950f2" />
				</div>
			) : (
				<>
					<header className="relative flex bg-slate-900/70 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
						<button
							onClick={onCloseMovie}
							className="absolute top-2 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white text-black text-xl hover:bg-[#fa5252] hover:text-white transition-colors shadow-md"
						>
							<Undo2 />
						</button>

						{/* Poster */}
						<img
							className="w-1/4 object-cover"
							src={poster}
							alt={`Poster of ${title}`}
						/>

						{/* Info */}
						<div className="flex flex-col gap-3 px-6 py-6 w-full">
							<h2 className="text-3xl  font-medium tracking-wide cinzel">
								{title}
							</h2>

							<div className="flex  flex-wrap gap-3 text-base text-gray-400">
								<span className="poppins">{released}</span>
								<span>&bull;</span>
								<span className="poppins">{runtime}</span>
								<span>&bull;</span>
								<span className="poppins">{genre}</span>
							</div>

							<p className="flex items-center gap-2 text-lg font-semibold text-yellow-400">
								⭐ {imdbRating}
								<span className="text-sm text-gray-400 font-normal">IMDb</span>
							</p>
						</div>
					</header>

					{/* Plot + Extra Info */}
					<section className="px-6 py-6 flex flex-col items-center gap-4">
						<div
							className="bg-slate-900/60 border border-slate-700/40 
                rounded-xl py-4 px-6 w-fit shadow-md flex flex-col items-center"
						>
							{" "}
							{!isWatched ? (
								<>
									<StarRating
										size="28px"
										onRatingChange={handleRatingChange}
										initialRating={userRating}
									/>
									<button
										className="inter mt-4 px-6 py-2.5 rounded-full 
										bg-gradient-to-r from-[#622dbd] to-[#4f46e5] 
										hover:from-[#6d28d9] hover:to-[#4338ca]
										text-white font-semibold shadow-lg shadow-indigo-500/30
										transition-all duration-300 ease-in-out
										hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
										onClick={() => onAddWatched(movie)}
										disabled={isWatched}
									>
										{isWatched ? "✅ Added" : "➕ Add to List"}
									</button>
								</>
							) : (
								<div className="text-center text-sm">
									{isClickedRetry || !isRated ? (
										<StarRating
											size="28px"
											onRatingChange={handleRatingChange}
											initialRating={userRating}
										/>
									) : (
										<p className="flex items-center justify-center gap-2">
											<span className="text-lg">
												You rated this movie{" "}
												<b className="text-[#fab005]">{userRating}</b> stars
											</span>
											<ReplayIcon
												sx={{
													fontSize: "22px",
													cursor: "pointer",
												}}
												onClick={handleRetry}
											/>
										</p>
									)}
								</div>
							)}
						</div>
						<div className="text-center raleway max-w-2xl space-y-2">
							<p className="italic text-base text-gray-300 leading-relaxed">
								{plot}
							</p>
							<p className="text-sm  text-gray-400 font-medium pt-4">
								🎭 Starring {actors}
							</p>
							<p className="text-sm text-gray-400">🎬 Directed by {director}</p>
						</div>
					</section>
					{/* <div>
						<h2 className="text-xl font-semibold text-indigo-400 mb-3">
							Recommended For You
						</h2> */}
					{similarMovies.length > 0 && (
						<div className="mt-6">
							<h3 className="text-lg font-semibold mb-3">
								Recommended For You
							</h3>
							<RecommendedMoviesGrid
								movies={similarMovies}
								onSelect={onSelectRecommended}
							/>
						</div>
					)}
					{/* </div> */}
				</>
			)}
		</div>
	);
}
