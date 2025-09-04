import { useState, useEffect, useRef } from "react";
import useKey from "./useKey";
// export function Loader() {
// 	return <p className="loader">Loading...</p>;
// }

export function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔</span> {message}
		</p>
	);
}

export function NavBar({ children }) {
	return (
		<nav className="bg-slate-950/80 backdrop-blur-md shadow-lg px-6 md:px-12 border-b border-slate-800">
			<div className="flex items-center justify-between h-13 md:h-18">
				<div className="flex items-center gap-3">
					<span role="img" className="text-4xl drop-shadow-md animate-bounce">
						🍿
					</span>
					<h1 className="raleway text-white text-2xl md:text-3xl font-bold tracking-wide hover:text-indigo-400 transition-colors duration-300">
						CineTrack
					</h1>
				</div>

				<div className="flex items-center gap-4 md:gap-6">{children}</div>
			</div>
		</nav>
	);
}

export function Search({ query, setQuery }) {
	const inputEl = useRef(null);

	// Focus with "/"
	useKey(
		"Slash",
		(e) => {
			if (document.activeElement === inputEl.current) return;
			e.preventDefault();
			inputEl.current.focus();
		},
		false
	);

	// Blur + clear with "Escape"
	useKey(
		"Escape",
		() => {
			if (document.activeElement === inputEl.current) {
				inputEl.current.blur();
				setQuery("");
			}
		},
		false
	);

	return (
		<div className="relative">
			<input
				ref={inputEl}
				//value={query} // ✅ bind to query
				onChange={(e) => setQuery(e.target.value)} // ✅ update query
				placeholder="Search movies..."
				className="w-40 sm:w-64 md:w-80 lg:w-96 
               px-5 py-2 
               rounded-full 
               bg-slate-700/70 text-gray-100 
               text-base md:text-lg leading-relaxed
               placeholder-gray-400 
               border border-slate-600 shadow-inner
               focus:outline-none focus:ring-2 focus:ring-indigo-500 
               focus:border-indigo-400 focus:bg-slate-800/80
               transition-all duration-300"
			/>
		</div>
	);
}

export function NumResults({ movies }) {
	return (
		<p
			className="text-gray-300 
              text-base md:text-lg 
              px-5 py-2 
              rounded-full 
              bg-slate-700 shadow-md 
              leading-relaxed"
		>
			Found{" "}
			<span className="raleway text-indigo-400 font-semibold">
				{movies.length}
			</span>{" "}
			results
		</p>
	);
}

export function Main({ children }) {
	return <main className="main">{children}</main>;
}

export function Box({ children }) {
	return <div className="box">{children}</div>;
}
