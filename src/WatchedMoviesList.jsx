import WatchedMovie from "./WatchedMovie";

export default function WatchedMoviesList({
	watched,
	onDeleteWatched,
	handleSelectMovie,
}) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatched={onDeleteWatched}
					onSelectMovie={handleSelectMovie}
				/>
			))}
		</ul>
	);
}
