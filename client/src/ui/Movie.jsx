import { Clapperboard, Calendar, CheckCircle2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
	hidden: { opacity: 0, y: 10, scale: 0.98 },
	visible: { opacity: 1, y: 0, scale: 1 },
};

function Movie({ movie, onSelectMovie, onAddWatch, isWatched }) {
	if (!movie) return null;

	return (
		<motion.li
			variants={itemVariants}
			layoutId={movie.imdbID}
			onClick={() => onSelectMovie(movie.imdbID)}
			className="group relative flex items-center gap-5 p-4 mb-3 rounded-2xl cursor-pointer 
                 bg-slate-800/40 border border-white/5 
                 hover:bg-slate-700/50 hover:border-indigo-500/30 
                 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] 
                 transition-all duration-300 overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<div className="relative w-[60px] h-[88px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
				{movie.Poster && movie.Poster !== "N/A" ? (
					<img
						src={movie.Poster}
						alt={`${movie.Title} poster`}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-slate-800 flex items-center justify-center">
						<Clapperboard className="w-6 h-6 text-gray-500" />
					</div>
				)}
			</div>

			<div className="flex flex-col flex-grow min-w-0 z-10">
				<h3 className="text-lg font-bold text-gray-100 truncate pr-2 font-poppins group-hover:text-indigo-300 transition-colors">
					{movie.Title}
				</h3>
				<p className="flex items-center gap-2 text-sm text-gray-400 mt-1">
					<Calendar className="w-3.5 h-3.5" />
					<span className="font-mono">{movie.Year}</span>
				</p>
			</div>

			<button
				onClick={(e) => {
					e.stopPropagation();
					onAddWatch(movie);
				}}
				className="z-10 p-2 rounded-full transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95"
			>
				{isWatched ? (
					<div className="flex flex-col items-center gap-1">
						<CheckCircle2 className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
					</div>
				) : (
					<div className="flex flex-col items-center gap-1 group/btn">
						<PlusCircle className="w-8 h-8 text-indigo-400 group-hover/btn:text-white transition-colors" />
					</div>
				)}
			</button>
		</motion.li>
	);
}

export default Movie;
