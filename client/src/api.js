import { auth } from "./firebase";
const BASE_URL = "http://localhost:5000";

async function authenticatedFetch(url, options = {}) {
	const user = auth.currentUser;
	if (!user) {
		throw new Error("User not logged in!");
	}
	const token = await user.getIdToken();

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
		...options.headers,
	};
	const response = await fetch(`${BASE_URL}${url}`, {
		...options,
		headers,
	});
	if (!response.ok) {
		const errorText = await response.text(); // Get server error message if any
		throw new Error(errorText || "API Request failed");
	}
	return response.json();
}

export async function getWatched() {
	return await authenticatedFetch("/watched");
}

export async function addWatchedMovie(movieData) {
	return await authenticatedFetch("/watched", {
		method: "POST",
		body: JSON.stringify(movieData),
	});
}

export async function deleteWatchedMovie(imdbID) {
	return await authenticatedFetch(`/watched/${imdbID}`, {
		method: "DELETE",
	});
}
