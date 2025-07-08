import { useState, useEffect, useRef } from "react";
import useKey from "./useKey";
import { func } from "prop-types";
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
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}

export function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>CineTrack </h1>
		</div>
	);
}

export function Search({ query, setQuery }) {
	const inputEl = useRef(null);
	// function handleCloseInput(e){
	// 	if(e.code==="Escape")
	// }

	useKey(
		"Slash",
		function (e) {
			if (document.activeElement === inputEl.current) return;
			e.preventDefault();
			inputEl.current.focus();
		},
		false
	);

	useKey(
		"Escape",
		function () {
			if (document.activeElement === inputEl.current) {
				inputEl.current.blur();
			}
		},
		false
	);
	return (
		<input
			ref={inputEl}
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
}

export function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

export function Main({ children }) {
	return <main className="main">{children}</main>;
}

export function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</button>
			{isOpen && children}
		</div>
	);
}
