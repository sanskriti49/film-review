import { useEffect, useState } from "react";
import "./index.css";
import { ErrorMessage, NavBar, Search, NumResults } from "./Components";
import { UserRound } from "lucide-react";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import WatchedMoviesList from "./WatchedMoviesList";
import WatchedSummary from "./WatchedSummary";
import { isMovieInList, findMovieInList } from "./utils";
import useMovies from "./useMovies";
import { BeatLoader } from "react-spinners";
import useLocalStorageState from "./useLocalStorageState";

export default function App() {
	const [watched, setWatched] = useLocalStorageState([], "watched");
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	const [userRating, setUserRating] = useState(null);
	const [isAdded, setIsAdded] = useState(false);
	const [isRated, setIsRated] = useState(false);
	const [recommended, setRecommended] = useState([]);
	const [trendingDetails, setTrendingDetails] = useState([]);
	const [ratingDecisions, setRatingDecisions] = useState(0);
	const { movies, isLoading, error } = useMovies(query);

	// This function works for movies that already have a proper imdbID
	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	// This function handles movies from TMDB by first finding their imdbID
	async function handleSelectRecommendedMovie(tmdbId) {
		try {
			const res = await fetch(
				`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=911f5b3092f6e66faf04d634cb0005fc`
			);
			if (!res.ok) throw new Error("Failed to fetch TMDB details");

			const data = await res.json();
			const imdbId = data.imdb_id;

			if (imdbId) {
				handleSelectMovie(imdbId); // Use the main selection function
			} else {
				console.error("No IMDb ID found for this movie.");
				// Optionally, you could set an error state here to inform the user
			}
		} catch (err) {
			console.error(err);
		}
	}

	// function createWatchedMovie(movie, userRating = 0, ratingDecisions = 0) {
	// 	return {
	// 		imdbID: movie.imdbID,
	// 		title: movie.Title || movie.title,
	// 		year: movie.Year || movie.year,
	// 		poster: movie.Poster || movie.poster,
	// 		imdbRating: Number(movie.imdbRating) || 0,
	// 		userRating: userRating || 0,
	// 		runtime: movie.Runtime
	// 			? parseInt(movie.Runtime.split(" ")[0])
	// 			: movie.runtime || 0,
	// 		countRatingDecisions: ratingDecisions,
	// 	};
	// }

	function createWatchedMovie(movie, userRating = 0, ratingDecisions = 0) {
		return {
			imdbID: movie.imdbID,
			// ✅ FIX: Use uppercase keys to match the data shape used everywhere else.
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

	// async function handleAddWatch(movie) {
	// 	const isMovieWatched = isMovieInList(watched, movie.imdbID);

	// 	if (isMovieWatched) {
	// 		const updatedWatched = watched.filter(
	// 			(watchedMovie) => watchedMovie.imdbID !== movie.imdbID
	// 		);
	// 		setWatched(updatedWatched);
	// 	} else {
	// 		try {
	// 			// We need the full details from OMDb to store runtime etc.
	// 			// This fetch might be redundant if the movie was just viewed,
	// 			// but is necessary if added directly from a list.
	// 			const res = await fetch(
	// 				`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=fdab5723`
	// 			);
	// 			if (!res.ok) throw new Error("Error fetching movie details");

	// 			const movieDetails = await res.json();
	// 			if (movieDetails.Response === "False")
	// 				throw new Error("Movie not found");

	// 			const newWatchedMovie = createWatchedMovie(
	// 				movieDetails,
	// 				userRating,
	// 				ratingDecisions
	// 			);
	// 			const updatedWatched = [...watched, newWatchedMovie];
	// 			setWatched(updatedWatched);
	// 		} catch (err) {
	// 			console.log("Failed to fetch movie details: ", err);
	// 		}
	// 	}
	// }
	// ~ App.js

	// ... other functions ...

	async function handleAddWatch(movie) {
		// Determine the correct IMDb ID, fetching it if necessary
		let correctImdbID = movie.imdbID;

		// If the ID doesn't look like a real imdbID, it's from TMDB
		if (!movie.imdbID.startsWith("tt")) {
			try {
				console.log(`Fetching IMDb ID for TMDB ID: ${movie.imdbID}`);
				const res = await fetch(
					`https://api.themoviedb.org/3/movie/${movie.imdbID}?api_key=911f5b3092f6e66faf04d634cb0005fc`
				);
				if (!res.ok) throw new Error("Failed to fetch TMDB details for adding");

				const data = await res.json();
				if (!data.imdb_id) {
					console.error("No IMDb ID found for this TMDB movie.");
					return; // Stop execution if we can't get the ID
				}
				correctImdbID = data.imdb_id;
				console.log(`Found IMDb ID: ${correctImdbID}`);
			} catch (err) {
				console.error(err);
				return; // Stop if the lookup fails
			}
		}

		// Now, proceed with the original logic using the correctImdbID
		const isMovieWatched = isMovieInList(watched, correctImdbID);

		if (isMovieWatched) {
			const updatedWatched = watched.filter(
				(watchedMovie) => watchedMovie.imdbID !== correctImdbID
			);
			setWatched(updatedWatched);
		} else {
			try {
				const res = await fetch(
					`https://www.omdbapi.com/?i=${correctImdbID}&apikey=fdab5723`
				);

				if (!res.ok) throw new Error("Error fetching movie details");

				const movieDetails = await res.json();
				if (movieDetails.Response === "False")
					throw new Error("Movie not found");

				const newWatchedMovie = createWatchedMovie(
					movieDetails,
					userRating,
					ratingDecisions
				);
				const updatedWatched = [...watched, newWatchedMovie];
				setWatched(updatedWatched);
			} catch (err) {
				console.log("Failed to fetch movie details: ", err);
			}
		}
	}

	// ... rest of your App.js component ...
	useEffect(() => {
		const isMovieWatched = findMovieInList(watched, selectedId);
		setIsAdded(Boolean(isMovieWatched));

		if (isMovieWatched) {
			setUserRating(isMovieWatched.userRating || 0); // Set user rating from watched list
		} else {
			setUserRating(null); // Reset rating if the movie is new
		}
	}, [watched, selectedId]);

	function handleDeleteWatch(id) {
		setWatched((watched) => {
			const updatedWatched = watched.filter((movie) => movie.imdbID !== id);
			return updatedWatched;
		});
	}

	// useEffect(() => {
	// 	async function getTrendingWithDetails() {
	// 		try {
	// 			const res = await fetch(
	// 				`https://api.themoviedb.org/3/trending/movie/week?api_key=911f5b3092f6e66faf04d634cb0005fc`
	// 			);
	// 			if (!res.ok) throw new Error("Failed to fetch trending movies");

	// 			const data = await res.json();
	// 			const normalized = data.results.map((m) => ({
	// 				imdbID: m.id.toString(), // Use TMDB id as the unique key for now
	// 				Title: m.title,
	// 				Year: m.release_date ? m.release_date.split("-")[0] : "—",
	// 				Poster: m.poster_path
	// 					? `https://image.tmdb.org/t/p/w300${m.poster_path}`
	// 					: null,
	// 			}));

	// 			setTrendingDetails(normalized);
	// 		} catch (err) {
	// 			console.error("Error fetching trending details:", err);
	// 		}
	// 	}

	// 	getTrendingWithDetails();
	// }, []);
	// In App.js

	// ...

	useEffect(() => {
		async function getTrendingWithDetails() {
			try {
				const res = await fetch(
					`https://api.themoviedb.org/3/trending/movie/week?api_key=911f5b3092f6e66faf04d634cb0005fc`
				);
				if (!res.ok) throw new Error("Failed to fetch trending movies");

				const data = await res.json();

				// ✅ FIX: Use .slice(0, 10) here to limit the trending results to 10
				const normalized = data.results.slice(0, 10).map((m) => ({
					imdbID: m.id.toString(), // Use TMDB id as the unique key for now
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

	// ...
	useEffect(() => {
		async function getRecommendations() {
			try {
				const res = await fetch("http://localhost:8000/recommendations/4");
				if (!res.ok) throw new Error("Failed to fetch");
				const data = await res.json();
				setRecommended(data);
				// console.log("Recommended movies: ", data);
			} catch (err) {
				console.error("Error fetching recommendations:", err);
			}
		}
		getRecommendations();
	}, []);

	const isSearching = query.length > 2;

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-gray-100 flex flex-col">
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={isSearching ? movies : []} />
				<UserRound />
			</NavBar>

			<main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
				{/* LEFT BOX: Dynamic Content (Trending or Search) */}
				<section className="backdrop-blur-md bg-slate-900/50 border border-slate-800/40 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 p-4 flex flex-col">
					<h2 className="text-xl raleway uppercase font-bold mb-3 text-slate-200 tracking-wide">
						{isSearching ? "Search Results" : "Trending Movies"}
					</h2>
					<div className="flex-1 overflow-y-auto pr-2">
						{isSearching ? (
							// SEARCH VIEW
							<>
								{isLoading && (
									<div className="flex items-center justify-center h-full">
										<BeatLoader color="#a78bfa" />
									</div>
								)}
								{!isLoading && !error && (
									<MovieList
										movies={movies}
										watched={watched}
										onSelectMovie={handleSelectRecommendedMovie}
										handleAddWatch={handleAddWatch}
										isMovieInList={isMovieInList}
									/>
								)}
								{error && <ErrorMessage message={error} />}
							</>
						) : (
							// TRENDING VIEW
							<>
								{trendingDetails.length === 0 ? (
									<div className="flex items-center justify-center h-full">
										<BeatLoader color="#a78bfa" />
									</div>
								) : (
									<MovieList
										movies={trendingDetails}
										watched={watched}
										// ✅ CORRECT: Use the TMDB handler for trending movies
										onSelectMovie={handleSelectRecommendedMovie}
										handleAddWatch={handleAddWatch}
										isMovieInList={isMovieInList}
									/>
								)}
							</>
						)}
					</div>
				</section>

				{/* RIGHT BOX: Watched List or Movie Details */}
				<section className="backdrop-blur-md bg-slate-900/50 border border-slate-800/40 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 p-4 flex flex-col overflow-hidden">
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
							isAdded={isAdded}
							setIsAdded={setIsAdded}
							onSelectRecommended={handleSelectRecommendedMovie}
							recommendedMovies={trendingDetails}
						/>
					) : (
						<div className="flex-1 flex flex-col overflow-y-auto pr-2">
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								// ✅ CORRECT: Watched movies have imdbID, so use direct handler
								handleSelectMovie={handleSelectMovie}
								onDeleteWatched={handleDeleteWatch}
								onSelectRecommended={handleSelectRecommendedMovie}
								recommendedMovies={trendingDetails}
							/>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
