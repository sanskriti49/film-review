import Movie from "./Movie";
import { motion } from "framer-motion";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

export default function MovieList({
	movies,
	onSelectMovie,
	watched,
	handleAddWatch,
}) {
	return (
		<motion.ul
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="backdrop-blur-md bg-slate-900/90 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 h-full"
		>
			{movies?.map((movie) => {
				const isWatched = watched.some(
					(watchedMovie) =>
						watchedMovie.Title === movie.Title &&
						watchedMovie.Year === movie.Year
				);
				return (
					<Movie
						movie={movie}
						key={movie.imdbID} // It's safer to use imdbID here as it's more unique
						onSelectMovie={onSelectMovie}
						onAddWatch={handleAddWatch}
						isWatched={isWatched}
					/>
				);
			})}
		</motion.ul>
	);
}
