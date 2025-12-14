import { motion } from "framer-motion";
import { Calculator, Clock, Film, Star } from "lucide-react";

function WatchedSummary({ watched }) {
	// 1. FIX: Standard Average Function
	const average = (arr) => {
		if (!Array.isArray(arr) || arr.length === 0) return 0;
		// Sum all numbers first, THEN divide by length
		return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
	};

	// 2. FIX: Calculate Total Runtime (Sum) instead of Average
	const totalRuntime = watched.reduce(
		(acc, movie) => acc + (Number(movie.runtime) || 0),
		0
	);

	// Calculate Averages
	const userRatings = watched
		.map((m) => Number(m.userRating) || 0)
		.filter((r) => r > 0);
	const avgUserRating = average(userRatings);

	const stats = [
		{
			icon: <Film className="w-4 h-4 text-cyan-400" />,
			value: watched.length,
			label: "Movies",
		},
		{
			icon: <Star className="w-4 h-4 text-yellow-400" />,
			value: avgUserRating > 0 ? avgUserRating.toFixed(1) : "-",
			label: "Your Rating",
		},
		{
			icon: <Clock className="w-4 h-4 text-fuchsia-400" />,
			value: totalRuntime,
			label: "Total Min",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative overflow-hidden rounded-2xl bg-[#1a1b3c]/60 backdrop-blur-xl border border-white/10 shadow-lg group"
		>
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70"></div>

			<div className="p-5">
				<h2 className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-200 mb-4 raleway flex items-center gap-2">
					<Calculator className="w-4 h-4" /> Library Stats
				</h2>

				<div className="grid grid-cols-3 gap-2">
					{stats.map((stat, idx) => (
						<div
							key={idx}
							className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
						>
							<div className="mb-1 opacity-90">{stat.icon}</div>
							<span className="text-lg font-bold text-white font-mono leading-none mb-1">
								{stat.value}
							</span>
							<span className="text-[10px] uppercase tracking-wider text-gray-400 text-center">
								{stat.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default WatchedSummary;
