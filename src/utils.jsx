export function isMovieInList(watched, id) {
	if (!watched || !Array.isArray(watched)) return false;
	return watched.some((movie) => movie.imdbID === id);
}

export function findMovieInList(watched, selectedId) {
	if (!watched || !Array.isArray(watched) || !selectedId) return null;
	return watched.find((movie) => movie.imdbID === selectedId);
}
