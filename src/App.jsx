import { useEffect, useState, useRef } from "react";
import "./index.css";
// import StarRating from "./StarRating";
import {
	ErrorMessage,
	NavBar,
	Search,
	NumResults,
	Main,
	Box,
} from "./Components";

import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import WatchedMoviesList from "./WatchedMoviesList";
import WatchedSummary from "./WatchedSummary";
import { isMovieInList, findMovieInList } from "./utils";
import useMovies from "./useMovies";
import { BeatLoader } from "react-spinners";
import useLocalStorageState from "./useLocalStorageState";

// async function fetchMovies(query, setMovies, setIsLoading, setError) {
// 	try {
// 		setIsLoading(true);
// 		setError(""); // Reset the error state
// 		const res = await fetch(
// 			`http://www.omdbapi.com/?s=${query}&apikey=fdab5723`
// 		);
// 		if (!res.ok) throw new Error("Something went wrong with fetching movies");
// 		const data = await res.json();
// 		if (data.Response === "False") throw new Error("Movie not found");
// 		setMovies(data.Search || []);
// 	} catch (err) {
// 		console.log(err.message);
// 		setError(err.message);
// 	} finally {
// 		setIsLoading(false);
// 	}
// }

export default function App() {
	// const [watched, setWatched] = useState([]);
	const [watched, setWatched] = useLocalStorageState([], "watched");

	const [query, setQuery] = useState("interstellar");
	const [selectedId, setSelectedId] = useState(null);
	const [userRating, setUserRating] = useState(null);
	const [isAdded, setIsAdded] = useState(false);

	const [isRated, setIsRated] = useState(false);

	// const countRef = useRef(0); // Now unique for each movie
	const [ratingDecisions, setRatingDecisions] = useState(0);
	const { movies, isLoading, error } = useMovies(query);

	const filteredMovies = movies.filter((movie) =>
		movie.Title.toLowerCase().includes(query.toLowerCase())
	);

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}
	function handleCloseMovie() {
		setSelectedId(null);
	}

	function createWatchedMovie(movie, userRating = 0, ratingDecisions = 0) {
		return {
			imdbID: movie.imdbID,
			title: movie.Title || movie.title,
			year: movie.Year || movie.year,
			poster: movie.Poster || movie.poster,
			imdbRating: Number(movie.imdbRating) || 0,
			userRating: userRating || 0,
			runtime: movie.Runtime
				? parseInt(movie.Runtime.split(" ")[0])
				: movie.runtime || 0,
			countRatingDecisions: ratingDecisions,
		};
	}

	async function handleAddWatch(movie) {
		const isMovieWatched = isMovieInList(watched, movie.imdbID);

		if (isMovieWatched) {
			// Update rating without removing the movie
			const updatedWatched = watched.filter(
				(watchedMovie) => watchedMovie.imdbID !== movie.imdbID
			);

			setWatched(updatedWatched);
		} else {
			try {
				const res = await fetch(
					`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=fdab5723`
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

	return (
		<>
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={filteredMovies} />
			</NavBar>
			<Main>
				<Box>
					{/* {isLoading ? <Loader /> : <MovieList movies={filteredMovies} />} */}
					{isLoading && (
						<div className="absolute-loader">
							<BeatLoader color="#36d7b7" />
						</div>
					)}
					{!isLoading &&
						!error && ( //if there is no error + if isLoading=false: that means data is not being loaded anymore
							<MovieList
								movies={filteredMovies}
								watched={watched}
								onSelectMovie={handleSelectMovie}
								handleAddWatch={handleAddWatch}
								isMovieInList={isMovieInList}
							/>
						)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							watched={watched}
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatch}
							userRating={userRating}
							setUserRating={setUserRating}
							createWatchedMovie={createWatchedMovie}
							isAdded={isAdded}
							setIsAdded={setIsAdded}
							setWatched={setWatched}
							isMovieInList={isMovieInList}
							findMovieInList={findMovieInList}
							isRated={isRated}
							setIsRated={setIsRated}
							ratingDecisions={ratingDecisions}
							setRatingDecisions={setRatingDecisions}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								setWatched={setWatched}
								watched={watched}
								handleSelectMovie={handleSelectMovie}
								onDeleteWatched={handleDeleteWatch}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
