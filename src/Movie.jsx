export default function Movie({
	movie,
	onSelectMovie,
	watched,
	handleAddWatch,
}) {
	const isWatched = watched.some(
		(watchedMovie) => watchedMovie.imdbID === movie.imdbID
	);

	return (
		<li
			onClick={() => onSelectMovie(movie.imdbID)}
			style={{
				display: "flex",
				alignItems: "center",
				// justifyContent: "space-between",
				gap: "22px",
			}}
		>
			<img
				src={movie.Poster}
				alt={`${movie.Title} poster`}
				style={{ height: "70px", width: "52px", margin: 0 }}
			/>
			<div
				className="movie-list"
				style={{
					display: "flex",
					gap: "4px",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					flexGrow: 1,
					maxWidth: "150px",
				}}
			>
				<h3 style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
					{movie.Title}
				</h3>

				<p>
					<span>📅</span>
					<span>{movie.Year}</span>
				</p>
			</div>
			<button
				className="add-btn"
				style={{
					margin: "0",
					marginLeft: "auto",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					flexShrink: 0,
					backgroundColor: "transparent",
					border: "none",
					cursor: "pointer",
				}}
				onClick={(e) => {
					e.stopPropagation();
					handleAddWatch(movie);
				}} // Add or remove movie from watched
			>
				<img
					src={isWatched ? "watched.png" : "add-to-watch.png"}
					style={{
						height: "48px",
					}}
				/>

				<p className="watch-text">{isWatched ? "Watched" : "Watch"}</p>
			</button>
		</li>
	);
}
