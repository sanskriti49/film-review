export default function WatchedMovie({
	movie,
	onDeleteWatched,
	onSelectMovie,
}) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>
						{movie.userRating !== 0 && movie.userRating !== null
							? movie.userRating + 1
							: "N/A"}
					</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
				<button
					className="btn-delete"
					onClick={() => {
						onDeleteWatched(movie.imdbID); // This updates the watched state
					}}
				>
					X
				</button>
			</div>
		</li>
	);
}
