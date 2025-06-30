// import { isMovieInList } from "./utils";
import Movie from "./movie";

export default function MovieList({
	movies,
	onSelectMovie,
	watched,
	isMovieInList,
	handleAddWatch,
}) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onSelectMovie={onSelectMovie}
					watched={watched}
					handleAddWatch={handleAddWatch}
					isMovieInList={isMovieInList}
				/>
			))}
		</ul>
	);
}
