function WatchedSummary({ watched }) {
	const average = (arr) => {
		if (!Array.isArray(arr) || arr.length === 0) return 0;
		return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
	};

	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	// if (watched.length === 0) {
	// 	return <p>No movies watched yet!</p>;
	// }

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(1)}</span>
				</p>
				<p>
					<span>🌟</span>
					{watched.length > 0 ? (
						<span>{(avgUserRating + 1).toFixed(1)}</span>
					) : (
						<span>0</span>
					)}
				</p>

				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(1)} min</span>
				</p>
			</div>
		</div>
	);
}
export default WatchedSummary;
