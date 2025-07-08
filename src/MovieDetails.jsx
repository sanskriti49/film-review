import StarRating from "./StarRating";
import { useState, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import ReplayIcon from "@mui/icons-material/Replay";
import useKey from "./useKey";

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
}) {
	const [movie, setMovie] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isClickedRetry, setIsClickedRetry] = useState(false);

	const isWatched = isMovieInList(watched, selectedId);
	const watchedMovie = findMovieInList(watched, selectedId);
	useKey("Escape", onCloseMovie);

	useEffect(() => {
		async function getMovieDetails(attempt = 1) {
			const MAX_ATTEMPTS = 3;
			setIsLoading(true);
			setError(null);
			setMovie(null);

			try {
				const res = await fetch(
					`http://www.omdbapi.com/?i=${selectedId}&apikey=fdab5723`
				);
				if (!res.ok) throw new Error("Error fetching movie details");

				const data = await res.json();
				if (data.Response === "False") throw new Error("Movie not found");

				setMovie(data);
			} catch (err) {
				if (attempt < MAX_ATTEMPTS) {
					setTimeout(() => getMovieDetails(attempt + 1), attempt * 1000);
				} else {
					setError("Failed to fetch movie details.");
				}
			} finally {
				setIsLoading(false);
			}
		}

		if (selectedId) getMovieDetails();
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
		setIsRated(newRating !== null && newRating !== 0);
		setIsClickedRetry(false);

		if (isWatched && !isRated) {
			// setRatingDecisions((prevCount) => prevCount + 1);

			// const updatedMovie = createWatchedMovie(
			// 	movie,
			// 	newRating,
			// 	ratingDecisions + 1
			// );
			// setWatched((prevWatched) =>
			// 	prevWatched.map((m) =>
			// 		m.imdbID === movie.imdbID
			// 			? {
			// 					...m,
			// 					userRating: newRating,
			// 					countRatingDecisions: ratingDecisions + 1,
			// 			  }
			// 			: m
			// 	)
			// );

			const currentCount = watchedMovie.countRatingDecisions || 0;
			const updatedMovie = createWatchedMovie(
				movie,
				newRating,
				currentCount + 1
			);

			setWatched((prev) =>
				prev.map((m) => (m.imdbID === movie.imdbID ? updatedMovie : m))
			);

			setIsRated(true);
		}
	}

	function handleAdd() {
		if (isWatched) return;
		const finalRating = userRating !== null ? userRating : 0;

		// Pass ratingDecisions as 1 because it's the first rating action
		const newWatchedMovie = createWatchedMovie(movie, finalRating, 1);

		onAddWatched(newWatchedMovie);
		handleRatingChange(finalRating);
		setRatingDecisions(1); // Reset rating decisions for this movie
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
		<div className="details">
			{isLoading ? (
				<div className="absolute-loader">
					<BeatLoader color="#36d7b7" />
				</div>
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${title} movie`} />

						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										size="27px"
										onRatingChange={handleRatingChange}
										rating={userRating}
									/>
									<button
										className="btn-add"
										onClick={handleAdd}
										disabled={isWatched}
									>
										{isWatched ? "Added to List" : "Add to List"}
									</button>
								</>
							) : (
								<p
									style={{
										fontSize: "15px",
										padding: "3px",
										width: 300,
										textAlign: "center",
									}}
								>
									{isClickedRetry || !isRated ? (
										<>
											<StarRating
												size="27px"
												onRatingChange={handleRatingChange}
												rating={userRating}
											/>
										</>
									) : isRated ? (
										<>
											<em>You rated this movie </em>
											<b>{userRating + 1}</b>
											<em> stars</em>
											<ReplayIcon
												sx={{
													fontSize: "25px",
													marginLeft: "6px",
													marginBottom: "-6px",
													cursor: "pointer",
												}}
												onClick={handleRetry}
											/>
										</>
									) : null}
								</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
