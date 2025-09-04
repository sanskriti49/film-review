import { BadgeX } from "lucide-react";
import { Clapperboard } from "lucide-react";

export default function WatchedMovie({
	movie,
	onDeleteWatched,
	onSelectMovie,
}) {
	return (
		<li
			className="px-4 cursor-pointer hover:bg-slate-800/70 relative grid grid-cols-[4rem_1fr]  rounded
            bg-slate-900/50 border-b border-slate-800/40 
            hover:shadow-indigo-500/20 transition-all duration-300 grid-rows-[auto_auto] gap-x-9 text-base items-center"
			onClick={() => onSelectMovie(movie.imdbID || movie.id)}
		>
			<div className="flex my-2 items-center justify-center bg-slate-800 rounded overflow-hidden">
				{movie.Poster && movie.Poster !== "N/A" ? (
					<img
						src={movie.Poster}
						// ✅ FIX: Changed movie.title to movie.Title
						alt={`${movie.Title} poster`}
						className=" row-span-full w-full"
					/>
				) : (
					<Clapperboard className="w-12 h-19 py-2 text-gray-400" />
				)}
			</div>

			<div className="flex">
				<div className="flex flex-col gap-4">
					{/* ✅ FIX: Changed movie.title to movie.Title */}
					<h3 className="text-lg raleway font-medium">{movie.Title}</h3>
					<div className="inter flex items-center gap-25 text-md font-semibold">
						<p>
							<span>⭐️</span>
							{/* This was already correct */}
							<span>{movie.imdbRating}</span>
						</p>
						<p>
							<span>🌟</span>
							<span>
								{/* This was already correct */}
								{movie.userRating !== 0 && movie.userRating !== null
									? movie.userRating
									: "N/A"}
							</span>
						</p>
						<p>
							<span>⏳</span>
							{/* This was already correct */}
							<span>{movie.runtime} min</span>
						</p>
						<button
							className="absolute right-15 cursor-pointer rounded-full p-1 hover:bg-[#fa5252] group transition duration-200 ease-in-out"
							onClick={(e) => {
								e.stopPropagation();
								onDeleteWatched(movie.imdbID);
							}}
						>
							<BadgeX className="w-5 h-5 text-[#fa5252] group-hover:text-white" />
						</button>
					</div>
				</div>
			</div>
		</li>
	);
}
