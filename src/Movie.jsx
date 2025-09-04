import { Clapperboard } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants for Framer Motion
const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

function Movie({ movie, onSelectMovie, onAddWatch, isWatched }) {
	// Handle cases where movie might be null or undefined
	if (!movie) return null;

	return (
		<motion.li
			variants={itemVariants}
			onClick={() => onSelectMovie(movie.imdbID)}
			className="flex items-center gap-4 px-6 py-4 cursor-pointer 
      bg-slate-900/50 border-b border-slate-800/40 text-lg
      hover:bg-slate-800/70 hover:border-b-slate-700/40 
      hover:shadow-indigo-500/20 transition-all duration-300"
		>
			<div className="w-[52px] h-[70px] flex-shrink-0 flex items-center justify-center bg-slate-800 rounded overflow-hidden">
				{movie.Poster && movie.Poster !== "N/A" ? (
					<img
						src={movie.Poster}
						alt={`${movie.Title} poster`}
						className="w-full h-full object-cover"
					/>
				) : (
					<Clapperboard className="w-8 h-8 text-gray-400" />
				)}
			</div>
			<div className="flex flex-col justify-center items-start flex-grow">
				<h3 className="break-words raleway">{movie.Title}</h3>
				<p className="flex items-center gap-1">
					<span>📅</span>
					<span className="inter text-base">{movie.Year}</span>
				</p>
			</div>

			<button
				className="flex flex-col items-center ml-auto cursor-pointer bg-transparent border-none group"
				onClick={(e) => {
					e.stopPropagation();
					onAddWatch(movie);
				}}
			>
				<img
					src={isWatched ? "/images/watched.png" : "/images/add-to-watch.png"}
					className="h-12"
					alt={isWatched ? "Remove from watched" : "Add to watched"}
				/>
				<p
					className={`watch-text text-[16px] font-sans font-[500]
          text-slate-400 transition-colors duration-200
          group-hover:text-white`}
				>
					{isWatched ? "Watched" : "Watch"}
				</p>
			</button>
		</motion.li>
	);
}

export default Movie;
