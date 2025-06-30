// import { useState, useEffect } from "react";

// //not a component, this is a real fxn
// export default function useMovies(query) {
// 	const [movies, setMovies] = useState([]);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState("");

// 	useEffect(
// 		function () {
// 			if (!query) {
// 				setMovies([]);
// 				return;
// 			}
// 			const controller = new AbortController();
// 			const debounceFetch = setTimeout(() => {
// 				if (query) {
// 			async function fetchMovies() {
// 				try {
// 					setIsLoading(true);
// 					setError(""); // Reset the error state
// 					const res = await fetch(
// 						`http://www.omdbapi.com/?s=${query}&apikey=fdab5723`,
// 						{ signal: controller.signal }
// 					);
// 					if (!res.ok)
// 						throw new Error("Something went wrong with fetching movies");

// 					const data = await res.json();
// 					if (data.Response === "False") throw new Error("Movie not found");
// 					setMovies(data.Search || []);
// 				} catch (err) {
// 					if (err.name !== "AbortError") {
// 						console.log(err.message);
// 						setError(err.message);
// 					}
// 				} finally {
// 					setIsLoading(false);
// 				}
// 			}

// 			fetchMovies();
// 		}
// 	},130),
// 		[query]
// 	);
// 	// Add a delay for the query using debounce
// 	useEffect(() => {
// 		const debounceFetch = setTimeout(() => {
// 			if (query) {
// 				fetchMovies(query, setMovies, setIsLoading, setError);
// 			}
// 		}, 130); //to make api calls less frequent

// 		return () => clearTimeout(debounceFetch);
// 	}, [query]);

// 	function handleSearch(query) {
// 		fetchMovies(query, setMovies, setIsLoading, setError);
// 	}
// 	return { movies, isLoading, error };
// }
import { useState, useEffect } from "react";

export default function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!query) {
			setMovies([]);
			setError("");
			return;
		}

		const controller = new AbortController();
		let timeoutId;

		const fetchMovies = async () => {
			try {
				setIsLoading(true);
				setError("");
				const res = await fetch(
					`http://www.omdbapi.com/?s=${query}&apikey=fdab5723`,
					{ signal: controller.signal }
				);

				if (!res.ok)
					throw new Error("Something went wrong with fetching movies");

				const data = await res.json();
				if (data.Response === "False") throw new Error("Movie not found");
				setMovies(data.Search || []);
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		};

		// Add debounce with 300ms delay
		timeoutId = setTimeout(fetchMovies, 300);

		// Cleanup function
		return () => {
			controller.abort();
			clearTimeout(timeoutId);
		};
	}, [query]);

	return { movies, isLoading, error };
}
