import { Clapperboard } from "lucide-react";

export default function RecommendedMoviesGrid({ movies, onSelect, limit = 8 }) {
	return (
		<ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
			{movies.slice(0, limit).map((movie) => (
				<li
					key={movie.id || movie.imdbID}
					className="group cursor-pointer bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20"
					onClick={() => onSelect(movie.imdbID || movie.id)}
				>
					<div className="aspect-[2/3] w-full relative overflow-hidden">
						{movie.Poster || movie.poster ? (
							<img
								src={movie.Poster || movie.poster}
								alt={movie.Title}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-slate-800">
								<Clapperboard className="w-8 h-8 text-slate-500" />
							</div>
						)}
						<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<span className="text-white text-xs font-bold border border-white/30 px-2 py-1 rounded-full backdrop-blur-sm">
								View
							</span>
						</div>
					</div>

					<div className="p-2">
						<p className="text-xs font-medium text-gray-300 truncate text-center">
							{movie.Title || movie.title}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
}
