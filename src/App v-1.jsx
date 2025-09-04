import { useState } from "react";
import "./index.css";

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

const average = (arr) => {
	if (arr.length === 0) return 0;
	return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
};

export default function App() {
	const [movies, setMovies] = useState(tempMovieData);
	const [watched, setWatched] = useState(tempWatchedData);

	const [query, setQuery] = useState("");

	const filteredMovies = movies.filter((movie) =>
		movie.Title.toLowerCase().includes(query.toLowerCase())
	);

	console.log(filteredMovies);

	return (
		<>
			<Navbar movies={filteredMovies} query={query} setQuery={setQuery} />
			<main className="main">
				<ListBox movies={filteredMovies} />
				<WatchedBox watched={watched} />
			</main>
		</>
	);
}

function Navbar({ movies, query, setQuery }) {
	return (
		<nav className="nav-bar">
			<Logo />
			<Search query={query} setQuery={setQuery} />
			<NumResults movies={movies} />
		</nav>
	);
}

function Logo() {
	return (
		<div className="logo">
			{/* <span role="img">🍿</span> */}
			<img src="/images/logo.jpeg" />
			<h1>CineTrack </h1>
		</div>
	);
}

function Search({ query, setQuery }) {
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
}

function NumResults({ movies = [] }) {
	return (
		<p className="">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function ListBox({ movies }) {
	const [isOpen1, setIsOpen1] = useState(true);

	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen1((open) => !open)}
			>
				{isOpen1 ? "–" : "+"}
			</button>
			{isOpen1 && <MovieList movies={movies} />}
		</div>
	);
}

function MovieList({ movies }) {
	return (
		<ul className="list">
			{movies?.map((movie) => (
				<Movie movie={movie} key={movie.imdbID} />
			))}
		</ul>
	);
}

function Movie({ movie, children }) {
	return (
		<li>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>📅</span>
					<span>{movie.Year}</span>
				</p>
				{children}
			</div>
		</li>
	);
}

function WatchedBox({ watched }) {
	const [isOpen2, setIsOpen2] = useState(true);

	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen2((open) => !open)}
			>
				{isOpen2 ? "–" : "+"}
			</button>
			{isOpen2 && (
				<>
					<WatchedSummary watched={watched} />
					<WatchedSummaryList watched={watched} />
				</>
			)}
		</div>
	);
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	if (watched.length === 0) {
		return <p>No movies watched yet!</p>;
	}

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
					<span>{avgImdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedSummaryList({ watched }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<Movie movie={movie} key={movie.imdbID}>
					<div>
						<p>
							<span>⭐️</span>
							<span>{movie.imdbRating}</span>
						</p>
						<p>
							<span>🌟</span>
							<span>{movie.userRating}</span>
						</p>
						<p>
							<span>⏳</span>
							<span>{movie.runtime} min</span>
						</p>
					</div>
				</Movie>
			))}
		</ul>
	);
}

// import { useEffect, useState } from "react";
// import "./index.css";

// const average = (arr) => {
// 	if (arr.length === 0) return 0;
// 	return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
// };

// // const KEY = "fdab5723";

// export default function App() {
// 	const [movies, setMovies] = useState([]);
// 	const [watched, setWatched] = useState([]);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [query, setQuery] = useState("");

// 	const filteredMovies = movies.filter((movie) =>
// 		movie.Title.toLowerCase().includes(query.toLowerCase())
// 	);

// 	// useEffect(function () {
// 	// 	fetch(`http://www.omdbapi.com/?s=interstellar&apikey=fdab5723`)
// 	// 		.then((res) => res.json())
// 	// 		// .then((data) => setMovies(data.Search)); without useffect, this is a bad idea as infinite loop of state setting happens
// 	// 		.then((data) => setMovies(data.Search));
// 	// }, []); //[] specifies that this effect only runs once, when the component mounts (first render
// 	//Without this array, the effect would run on every render, leading to an infinite loop if state is being updated, as you'll see below.
// 	//it is Only re-run this effect if the values inside the array change.
// 	useEffect(function () {
// 		async function fetchMovies() {
// 			setIsLoading(true);
// 			const res = await fetch(
// 				`http://www.omdbapi.com/?s=interstellar&apikey=fdab5723`
// 			);
// 			const data = await res.json();
// 			console.log(data);
// 			setMovies(data.Search);

// 			setIsLoading(false);
// 		}
// 		fetchMovies();
// 	}, []);

// 	return (
// 		<>
// 			<Navbar movies={filteredMovies} query={query} setQuery={setQuery}>
// 				<Search query={query} setQuery={setQuery} />
// 				<NumResults movies={movies} />
// 			</Navbar>
// 			<main className="main">
// 				<ListBox movies={filteredMovies} />
// 				<WatchedBox watched={watched} />
// 			</main>
// 		</>
// 	);
// }

// function Navbar({ movies, query, setQuery }) {
// 	return (
// 		<nav className="nav-bar">
// 			<Logo />
// 		</nav>
// 	);
// }

// function Logo() {
// 	return (
// 		<div className="logo">
// 			<span role="img">🍿</span>
// 			<h1>usePopcorn</h1>
// 		</div>
// 	);
// }

// function Search({ query, setQuery }) {
// 	return (
// 		<input
// 			className="search"
// 			type="text"
// 			placeholder="Search movies..."
// 			value={query}
// 			onChange={(e) => setQuery(e.target.value)}
// 		/>
// 	);
// }

// function NumResults({ movies = [] }) {
// 	return (
// 		<p className="num-results">
// 			Found <strong>{movies.length}</strong> results
// 		</p>
// 	);
// }

// function ListBox({ movies }) {
// 	const [isOpen1, setIsOpen1] = useState(true);

// 	return (
// 		<div className="box">
// 			<button
// 				className="btn-toggle"
// 				onClick={() => setIsOpen1((open) => !open)}
// 			>
// 				{isOpen1 ? "–" : "+"}
// 			</button>
// 			{isOpen1 && <MovieList movies={movies} />}
// 		</div>
// 	);
// }

// function MovieList({ movies }) {
// 	return (
// 		<ul className="list">
// 			{movies?.map((movie) => (
// 				<Movie movie={movie} key={movie.imdbID} />
// 			))}
// 		</ul>
// 	);
// }

// function Movie({ movie, children }) {
// 	return (
// 		<li>
// 			<img src={movie.Poster} alt={`${movie.Title} poster`} />
// 			<h3>{movie.Title}</h3>
// 			<div>
// 				<p>
// 					<span>📅</span>
// 					<span>{movie.Year}</span>
// 				</p>
// 				{children}
// 			</div>
// 		</li>
// 	);
// }

// function WatchedBox({ watched }) {
// 	const [isOpen2, setIsOpen2] = useState(true);

// 	return (
// 		<div className="box">
// 			<button
// 				className="btn-toggle"
// 				onClick={() => setIsOpen2((open) => !open)}
// 			>
// 				{isOpen2 ? "–" : "+"}
// 			</button>
// 			{isOpen2 && (
// 				<>
// 					<WatchedSummary watched={watched} />
// 					<WatchedSummaryList watched={watched} />
// 				</>
// 			)}
// 		</div>
// 	);
// }

// function WatchedSummary({ watched }) {
// 	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
// 	const avgUserRating = average(watched.map((movie) => movie.userRating));
// 	const avgRuntime = average(watched.map((movie) => movie.runtime));

// 	if (watched.length === 0) {
// 		return <p>No movies watched yet!</p>;
// 	}

// 	return (
// 		<div className="summary">
// 			<h2>Movies you watched</h2>
// 			<div>
// 				<p>
// 					<span>#️⃣</span>
// 					<span>{watched.length} movies</span>
// 				</p>
// 				<p>
// 					<span>⭐️</span>
// 					<span>{avgImdbRating}</span>
// 				</p>
// 				<p>
// 					<span>🌟</span>
// 					<span>{avgUserRating}</span>
// 				</p>
// 				<p>
// 					<span>⏳</span>
// 					<span>{avgRuntime} min</span>
// 				</p>
// 			</div>
// 		</div>
// 	);
// }

// function WatchedSummaryList({ watched }) {
// 	return (
// 		<ul className="list">
// 			{watched.map((movie) => (
// 				<Movie movie={movie} key={movie.imdbID}>
// 					<div>
// 						<p>
// 							<span>⭐️</span>
// 							<span>{movie.imdbRating}</span>
// 						</p>
// 						<p>
// 							<span>🌟</span>
// 							<span>{movie.userRating}</span>
// 						</p>
// 						<p>
// 							<span>⏳</span>
// 							<span>{movie.runtime} min</span>
// 						</p>
// 					</div>
// 				</Movie>
// 			))}
// 		</ul>
// 	);
// }
