// import { BadgeX } from "lucide-react";
// import { Clapperboard } from "lucide-react";

// export default function WatchedMovie({
// 	movie,
// 	onDeleteWatched,
// 	onSelectMovie,
// }) {
// 	return (
// 		<li
// 			className="px-4 cursor-pointer hover:bg-slate-800/70 relative grid grid-cols-[4rem_1fr]  rounded
//             bg-slate-900/50 border-b border-slate-800/40
//             hover:shadow-indigo-500/20 transition-all duration-300 grid-rows-[auto_auto] gap-x-9 text-base items-center"
// 			onClick={() => onSelectMovie(movie.imdbID || movie.id)}
// 		>
// 			<div className="flex my-2 items-center justify-center bg-slate-800 rounded overflow-hidden">
// 				{movie.Poster && movie.Poster !== "N/A" ? (
// 					<img
// 						src={movie.Poster}
// 						// ✅ FIX: Changed movie.title to movie.Title
// 						alt={`${movie.Title} poster`}
// 						className=" row-span-full w-full"
// 					/>
// 				) : (
// 					<Clapperboard className="w-12 h-19 py-2 text-gray-400" />
// 				)}
// 			</div>

// 			<div className="flex">
// 				<div className="flex flex-col gap-4">
// 					{/* ✅ FIX: Changed movie.title to movie.Title */}
// 					<h3 className="text-lg raleway font-medium">{movie.Title}</h3>
// 					<div className="inter flex items-center gap-25 text-md font-semibold">
// 						<p>
// 							<span>⭐️</span>
// 							{/* This was already correct */}
// 							<span>{movie.imdbRating}</span>
// 						</p>
// 						<p>
// 							<span>🌟</span>
// 							<span>
// 								{/* This was already correct */}
// 								{movie.userRating !== 0 && movie.userRating !== null
// 									? movie.userRating
// 									: "N/A"}
// 							</span>
// 						</p>
// 						<p>
// 							<span>⏳</span>
// 							{/* This was already correct */}
// 							<span>{movie.runtime} min</span>
// 						</p>
// 						<button
// 							className="absolute right-15 cursor-pointer rounded-full p-1 hover:bg-[#fa5252] group transition duration-200 ease-in-out"
// 							onClick={(e) => {
// 								e.stopPropagation();
// 								onDeleteWatched(movie.imdbID);
// 							}}
// 						>
// 							<BadgeX className="w-5 h-5 text-[#fa5252] group-hover:text-white" />
// 						</button>
// 					</div>
// 				</div>
// 			</div>
// 		</li>
// 	);
// }
import { Trash2, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function WatchedMovie({
	movie,
	onDeleteWatched,
	onSelectMovie,
}) {
	return (
		<motion.li
			layout
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
			whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
			className="group relative grid grid-cols-[3.5rem_1fr] gap-4 items-center 
                 p-3 rounded-xl cursor-pointer
                 bg-slate-900/40 border-b border-white/5 
                 hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] 
                 transition-all duration-300"
			onClick={() => onSelectMovie(movie.imdbID || movie.id)}
		>
			{/* Poster */}
			<div className="relative aspect-[2/3] w-14 rounded-lg overflow-hidden shadow-md">
				<img
					src={movie.Poster}
					alt={`${movie.Title} poster`}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
			</div>

			{/* Info */}
			<div className="flex flex-col gap-1 min-w-0">
				<h3 className="text-base font-semibold text-gray-100 truncate pr-8 font-raleway group-hover:text-indigo-300 transition-colors">
					{movie.Title}
				</h3>

				<div className="flex items-center gap-4 text-xs font-medium text-gray-400">
					<div className="flex items-center gap-1">
						<Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
						<span>{movie.imdbRating}</span>
					</div>

					<div className="flex items-center gap-1">
						<span className="text-emerald-400">★</span>
						<span
							className={`${
								movie.userRating ? "text-emerald-300" : "text-gray-600"
							}`}
						>
							{movie.userRating || "-"}
						</span>
					</div>

					<div className="flex items-center gap-1">
						<Clock className="w-3 h-3 text-gray-500" />
						<span>{movie.runtime} min</span>
					</div>
				</div>
			</div>

			{/* Delete Button - Appears on Hover */}
			<button
				className="absolute right-3 p-2 rounded-full text-gray-500 opacity-0 
                   group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 
                   transition-all duration-200 transform translate-x-2 group-hover:translate-x-0"
				onClick={(e) => {
					e.stopPropagation();
					onDeleteWatched(movie.imdbID);
				}}
				title="Remove from library"
			>
				<Trash2 className="w-4 h-4" />
			</button>
		</motion.li>
	);
}
