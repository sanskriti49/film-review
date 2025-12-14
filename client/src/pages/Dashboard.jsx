import { useEffect, useState } from "react";
import {
	NavBar,
	ErrorMessage,
	Search,
	NumResults,
	UserMenu,
	MobileMenu,
} from "../components/Components";
import { Sparkles, UserRound } from "lucide-react";
import MovieList from "../ui/MovieList";
import MovieDetails from "../ui/MovieDetails";
import WatchedMoviesList from "../ui/WatchedMoviesList";
import WatchedSummary from "../ui/WatchedSummary";
import { isMovieInList, findMovieInList } from "../utils";
import useMovies from "../hooks/useMovies";
import { BeatLoader } from "react-spinners";
import { getWatched, addWatchedMovie, deleteWatchedMovie } from "../api";
import { auth } from "../firebase";
import { useAlert } from "../contexts/AlertContext";

export default function Dashboard({ user }) {
	const { showAlert } = useAlert(); // Get hook

	const [watched, setWatched] = useState([]);
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	const [userRating, setUserRating] = useState(null);
	const [isAdded, setIsAdded] = useState(false);
	const [isRated, setIsRated] = useState(false);
	const [trendingDetails, setTrendingDetails] = useState([]);
	const [ratingDecisions, setRatingDecisions] = useState(0);
	const { movies, isLoading, error } = useMovies(query);

	const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	async function handleSelectRecommendedMovie(tmdbId) {
		try {
			const res = await fetch(
				`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}`
			);
			if (!res.ok) throw new Error("Failed to fetch TMDB details");

			const data = await res.json();
			const imdbId = data.imdb_id;

			if (imdbId) {
				handleSelectMovie(imdbId);
			} else {
				console.error("No IMDb ID found for this movie.");
			}
		} catch (err) {
			console.error(err);
		}
	}

	function createWatchedMovie(movie, userRating = 0, ratingDecisions = 0) {
		return {
			imdbID: movie.imdbID || movie.imdb_id,
			Title: movie.Title || movie.title,
			Year: movie.Year || movie.year,
			Poster: movie.Poster || movie.poster,
			imdbRating: Number(movie.imdbRating) || 0,
			userRating: userRating || 0,
			runtime: movie.Runtime
				? parseInt(movie.Runtime.split(" ")[0])
				: movie.runtime || 0,
			countRatingDecisions: ratingDecisions,
		};
	}

	async function handleAddWatch(movie) {
		let correctImdbID = movie.imdbID;

		if (!movie.imdbID.startsWith("tt")) {
			try {
				const res = await fetch(
					`https://api.themoviedb.org/3/movie/${movie.imdbID}?api_key=${API_KEY}`
				);
				const data = await res.json();
				if (!data.imdb_id) return;
				correctImdbID = data.imdb_id;
			} catch (err) {
				console.error(err);
				return;
			}
		}

		const isMovieWatched = isMovieInList(watched, correctImdbID);

		if (isMovieWatched) {
			showAlert("Movie already in library!", "error"); // Alert for duplicate
			return;
		}

		try {
			const res = await fetch(
				`https://www.omdbapi.com/?i=${correctImdbID}&apikey=fdab5723`
			);
			const movieDetails = await res.json();
			if (movieDetails.Response === "False") throw new Error("Movie not found");

			const newWatchedMovie = createWatchedMovie(
				movieDetails,
				userRating,
				ratingDecisions
			);

			setWatched((prev) => [...prev, newWatchedMovie]);
			showAlert(`Added "${newWatchedMovie.Title}" to library!`, "success"); // Success alert

			try {
				await addWatchedMovie(newWatchedMovie);
			} catch (err) {
				showAlert("Failed to sync with database", "error");
			}
		} catch (err) {
			showAlert("Failed to add movie", "error");
		}
	}

	async function handleDeleteWatch(imdbID) {
		// Optimistic UI update
		setWatched((prev) => prev.filter((m) => m.imdbID !== imdbID));
		showAlert("Movie removed from library", "success");
		// REAL DB delete

		try {
			await deleteWatchedMovie(imdbID);
		} catch (err) {
			showAlert("Failed to delete from DB", "error");
		}
	}

	useEffect(() => {
		async function loadData() {
			try {
				// Wait for Firebase to confirm identity so we have a token
				await auth.authStateReady();

				if (auth.currentUser) {
					const data = await getWatched();
					// setWatched(data);
					setWatched(
						data.map((m) => ({
							imdbID: m.imdbid,
							Title: m.title,
							Poster: m.poster,
							runtime: m.runtime,
							imdbRating: m.imdbrating,
							userRating: m.userrating,
						}))
					);
				}
			} catch (err) {
				console.error("Failed to load watched movies", err);
			}
		}
		loadData();
	}, []);

	useEffect(() => {
		const isMovieWatched = findMovieInList(watched, selectedId);
		setIsAdded(Boolean(isMovieWatched));

		if (isMovieWatched) {
			setUserRating(isMovieWatched.userRating || 0); // Set user rating from watched list
		} else {
			setUserRating(null); // Reset rating if the movie is new
		}
	}, [watched, selectedId]);

	useEffect(() => {
		async function getTrendingWithDetails() {
			try {
				const res = await fetch(
					`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
				);
				if (!res.ok) throw new Error("Failed to fetch trending movies");

				const data = await res.json();

				const normalized = data.results.slice(0, 10).map((m) => ({
					imdbID: m.id.toString(),
					Title: m.title,
					Year: m.release_date ? m.release_date.split("-")[0] : "—",
					Poster: m.poster_path
						? `https://image.tmdb.org/t/p/w300${m.poster_path}`
						: null,
				}));

				setTrendingDetails(normalized);
			} catch (err) {
				console.error("Error fetching trending details:", err);
			}
		}

		getTrendingWithDetails();
	}, []);

	// useEffect(() => {
	// 	async function getRecommendations() {
	// 		try {
	// 			const res = await fetch("http://localhost:8000/recommendations/4");
	// 			if (!res.ok) throw new Error("Failed to fetch");
	// 			const data = await res.json();
	// 			setRecommended(data);
	// 			// console.log("Recommended movies: ", data);
	// 		} catch (err) {
	// 			console.error("Error fetching recommendations:", err);
	// 		}
	// 	}
	// 	getRecommendations();
	// }, []);

	const isSearching = query.length > 2;

	return (
		<div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<div className="flex items-center gap-4 ml-auto">
					<NumResults query={query} movies={isSearching ? movies : []} />

					{user ? (
						<>
							{/* Desktop Dropdown */}
							<UserMenu user={user} />
							{/* Mobile Drawer */}
							<MobileMenu user={user} />
						</>
					) : (
						<Link
							to="/login"
							className="cursor-pointer ml-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-full transition shadow-lg shadow-indigo-500/20 whitespace-nowrap"
						>
							Sign In
						</Link>
					)}
				</div>
			</NavBar>

			<main className="flex-1 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] gap-8 p-6 lg:p-8 h-[calc(100vh-5rem)]">
				{/* LEFT BOX: Search / Trending */}
				<section className="relative flex flex-col backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden group">
					{/* Decorative Gradient Blob */}
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

					<div className="p-6 pb-2 flex items-center justify-between z-10">
						<h2 className="text-2xl raleway font-bold text-white tracking-wide flex items-center gap-2">
							{isSearching ? (
								"Search Results"
							) : (
								<>
									<Sparkles className="text-yellow-400 w-5 h-5" /> Trending Now
								</>
							)}
						</h2>
					</div>

					<div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
						{isSearching ? (
							<>
								{isLoading && (
									<div className="flex items-center justify-center h-64">
										<BeatLoader color="#818cf8" size={15} />
									</div>
								)}
								{!isLoading && !error && (
									<MovieList
										movies={movies}
										watched={watched}
										onSelectMovie={handleSelectRecommendedMovie} // Logic kept
										handleAddWatch={handleAddWatch}
										isMovieInList={isMovieInList}
									/>
								)}
								{error && <ErrorMessage message={error} />}
							</>
						) : (
							<>
								{trendingDetails.length === 0 ? (
									<div className="flex items-center justify-center h-64">
										<BeatLoader color="#818cf8" size={15} />
									</div>
								) : (
									<MovieList
										movies={trendingDetails}
										watched={watched}
										onSelectMovie={handleSelectRecommendedMovie}
										handleAddWatch={handleAddWatch}
										isMovieInList={isMovieInList}
									/>
								)}
							</>
						)}
					</div>
				</section>

				{/* RIGHT BOX: Details / Watched */}
				<section className="relative flex flex-col backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
					{selectedId ? (
						<MovieDetails
							watched={watched}
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatch}
							userRating={userRating}
							setUserRating={setUserRating}
							createWatchedMovie={createWatchedMovie}
							setWatched={setWatched}
							isMovieInList={isMovieInList}
							findMovieInList={findMovieInList}
							isRated={isRated}
							setIsRated={setIsRated}
							ratingDecisions={ratingDecisions}
							setRatingDecisions={setRatingDecisions}
							onSelectRecommended={handleSelectRecommendedMovie}
							recommendedMovies={trendingDetails}
						/>
					) : (
						<div className="flex flex-col h-full">
							<div className="p-6 bg-gradient-to-b from-indigo-900/30 to-transparent">
								<WatchedSummary watched={watched} />
							</div>
							<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
								<WatchedMoviesList
									watched={watched}
									handleSelectMovie={handleSelectMovie}
									onDeleteWatched={handleDeleteWatch}
									onSelectRecommended={handleSelectRecommendedMovie}
									recommendedMovies={trendingDetails}
								/>
							</div>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
