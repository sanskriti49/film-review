import { Clapperboard } from "lucide-react";

export default function RecommendedMoviesGrid({ movies, onSelect, limit = 8 }) {
	return (
		<ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
			{movies.slice(0, limit).map((movie) => (
				<li
					key={movie.id || movie.imdbID}
					className="cursor-pointer bg-slate-800/70 rounded-xl p-2 hover:bg-slate-700/70 transition-all"
					onClick={() => onSelect(movie.imdbID || movie.id)}
				>
					{/* FIX: Check for EITHER 'Poster' OR 'poster' */}
					{movie.Poster || movie.poster ? (
						<img
							src={movie.Poster || movie.poster}
							alt={movie.Title || movie.title}
							className="w-full h-48 object-cover rounded-lg mb-2"
						/>
					) : (
						<div className="w-full h-48 flex items-center justify-center bg-slate-700 rounded-lg mb-2">
							<Clapperboard className="w-10 h-10 text-slate-400" />
						</div>
					)}

					<p className="text-sm text-slate-200 truncate">
						{movie.Title || movie.title}
					</p>
				</li>
			))}
		</ul>
	);
}
