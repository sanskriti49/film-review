// import { motion } from "framer-motion";

// function WatchedSummary({ watched }) {
// 	const average = (arr) => {
// 		if (!Array.isArray(arr) || arr.length === 0) return 0;
// 		return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
// 	};

// 	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
// 	const avgUserRating = average(watched.map((movie) => movie.userRating));
// 	const avgRuntime = average(watched.map((movie) => movie.runtime));

// 	const stats = [
// 		{ icon: "🎬", value: `${watched.length}`, label: "Movies" },
// 		{ icon: "⭐️", value: avgImdbRating.toFixed(1), label: "IMDb Avg" },
// 		{
// 			icon: "🌟",
// 			value: watched.length > 0 ? avgUserRating.toFixed(1) : "0",
// 			label: "Your Avg",
// 		},
// 		{ icon: "⏳", value: `${avgRuntime.toFixed(1)}`, label: "Min Avg" },
// 	];

// 	return (
// 		<>
// 			<motion.div
// 				initial={{ opacity: 0, y: -10 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				transition={{ duration: 0.4 }}
// 				className="backdrop-blur-md bg-slate-900/50 border border-slate-800/40
// +            rounded-xl p-3 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out"
// 			>
// 				<h2 className="text-sm font-bold tracking-wide uppercase mb-2 text-slate-100 raleway">
// 					Movies You Watched
// 				</h2>

// 				<div className="grid grid-cols-4 gap-3 text-center">
// 					{stats.map((stat, idx) => (
// 						<motion.div
// 							key={idx}
// 							initial={{ opacity: 0, scale: 0.9 }}
// 							animate={{ opacity: 1, scale: 1 }}
// 							transition={{ delay: idx * 0.1, duration: 0.3 }}
// 							className="flex flex-col items-center bg-white/5
// 							rounded-lg p-2 hover:bg-white/10 transition-colors inter"
// 						>
// 							<span className="text-lg">{stat.icon}</span>
// 							<p className="text-slate-200 text-sm font-semibold">
// 								{stat.value}
// 							</p>
// 							<span className="text-[10px] text-slate-400">{stat.label}</span>
// 						</motion.div>
// 					))}
// 				</div>
// 			</motion.div>
// 		</>
// 	);
// }

// export default WatchedSummary;
import { motion } from "framer-motion";
import { Calculator, Clock, Film, Star } from "lucide-react";

function WatchedSummary({ watched }) {
	const average = (arr) => {
		if (!Array.isArray(arr) || arr.length === 0) return 0;
		return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
	};

	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	const stats = [
		{
			icon: <Film className="w-4 h-4 text-cyan-400" />,
			value: watched.length,
			label: "Movies",
		},
		{
			icon: <Star className="w-4 h-4 text-yellow-400" />,
			value: avgImdbRating.toFixed(1),
			label: "IMDb",
		},
		{
			icon: <Star className="w-4 h-4 text-emerald-400" />,
			value: watched.length > 0 ? avgUserRating.toFixed(1) : "-",
			label: "You",
		},
		{
			icon: <Clock className="w-4 h-4 text-fuchsia-400" />,
			value: avgRuntime.toFixed(0),
			label: "Min",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative overflow-hidden rounded-2xl bg-[#1a1b3c]/60 backdrop-blur-xl border border-white/10 shadow-lg group"
		>
			{/* Animated Gradient Border Effect */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70"></div>

			<div className="p-5">
				<h2 className="text-sm font-bold tracking-[0.2em] uppercase text-indigo-200 mb-4 raleway flex items-center gap-2">
					<Calculator className="w-4 h-4" /> Library Stats
				</h2>

				<div className="grid grid-cols-4 gap-2">
					{stats.map((stat, idx) => (
						<div
							key={idx}
							className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
						>
							<div className="mb-1 opacity-90">{stat.icon}</div>
							<span className="text-lg font-bold text-white font-mono leading-none mb-1">
								{stat.value}
							</span>
							<span className="text-[10px] uppercase tracking-wider text-gray-400">
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
