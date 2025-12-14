import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	UserRound,
	LogOut,
	Menu,
	X,
	Settings,
	Search as SearchIcon,
	ChevronDown,
} from "lucide-react";
import { auth } from "../firebase";

// --- 1. LOGO COMPONENT ---
export function Logo() {
	return (
		<div className="flex items-center gap-2 mr-4">
			<span className="cursor-pointer text-3xl">🍿</span>
			<h1 className="cursor-pointer text-2xl font-bold cinzel text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 hidden sm:block">
				CineTrack
			</h1>
		</div>
	);
}

// --- 2. SEARCH COMPONENT (Responsive) ---
export function Search({ query, setQuery }) {
	const inputRef = useRef(null);

	useEffect(() => {
		function callback(e) {
			if (document.activeElement === inputRef.current) return;
			if (e.code === "Enter") {
				inputRef.current.focus();
				setQuery("");
			}
		}
		document.addEventListener("keydown", callback);
		return () => document.removeEventListener("keydown", callback);
	}, [setQuery]);

	return (
		<div className="relative flex-1 max-w-xl mx-auto transition-all duration-300">
			<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
			<input
				className="w-full bg-slate-900/50 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-indigo-100 placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800 transition-all shadow-inner text-sm md:text-base"
				type="text"
				placeholder="Search for a movie..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				ref={inputRef}
			/>
		</div>
	);
}

// --- 3. DESKTOP USER DROPDOWN ---
export function UserMenu({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const handleLogout = async () => {
		await auth.signOut();
		navigate("/login");
	};

	return (
		<div className="relative z-50 hidden md:block ml-4">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="cursor-pointer flex items-center gap-2 p-1.5 pr-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all duration-200"
			>
				<div className="p-1.5 bg-indigo-500/20 rounded-full">
					<UserRound className="w-5 h-5 text-indigo-200" />
				</div>
				<span className="text-sm font-medium text-indigo-100 max-w-[100px] truncate">
					{user.displayName?.split(" ")[0] || "My List"}
				</span>
				<ChevronDown
					className={`w-4 h-4 text-indigo-300 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="absolute right-0 mt-2 w-56 bg-[#161229] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
						>
							<div className="px-4 py-3 border-b border-white/5 bg-white/5">
								<p className="text-xs text-indigo-300 uppercase font-bold tracking-wider mb-1">
									Signed in as
								</p>
								<p className="text-sm text-white truncate font-medium">
									{user.email}
								</p>
							</div>

							<button className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-indigo-100 hover:bg-indigo-500/20 flex items-center gap-2 transition-colors">
								<Settings className="w-4 h-4" /> Account Settings
							</button>

							<button
								onClick={handleLogout}
								className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 flex items-center gap-2 transition-colors"
							>
								<LogOut className="w-4 h-4" /> Sign Out
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

// --- 4. MOBILE HAMBURGER MENU ---
// export function MobileMenu({ user }) {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const navigate = useNavigate();

// 	const handleLogout = async () => {
// 		await auth.signOut();
// 		navigate("/login");
// 	};

// 	return (
// 		<div className="md:hidden ml-2">
// 			<button
// 				onClick={() => setIsOpen(true)}
// 				className="cursor-pointer p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition"
// 			>
// 				<Menu className="w-6 h-6" />
// 			</button>

// 			<AnimatePresence>
// 				{isOpen && (
// 					<>
// 						<motion.div
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 							onClick={() => setIsOpen(false)}
// 							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
// 						/>
// 						<motion.div
// 							initial={{ x: "100%" }}
// 							animate={{ x: 0 }}
// 							exit={{ x: "100%" }}
// 							transition={{ type: "spring", damping: 25, stiffness: 200 }}
// 							className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-[#161229] border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col"
// 						>
// 							<div className="flex items-center justify-between mb-8">
// 								<span className="text-2xl font-bold text-white">Menu</span>
// 								<button
// 									onClick={() => setIsOpen(false)}
// 									className="cursor-pointer p-2 text-indigo-300 hover:bg-white/10 rounded-full"
// 								>
// 									<X className="w-6 h-6" />
// 								</button>
// 							</div>

// 							{user ? (
// 								<div className="space-y-6 ">
// 									<div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
// 										<div className="p-2 bg-indigo-500/20 rounded-full">
// 											<UserRound className="w-6 h-6 text-indigo-200" />
// 										</div>
// 										<div className="overflow-hidden">
// 											<p className="font-bold text-white truncate">
// 												{user.displayName || "User"}
// 											</p>
// 											<p className="text-xs text-indigo-300 truncate">
// 												{user.email}
// 											</p>
// 										</div>
// 									</div>

// 									<div className="space-y-2">
// 										<button className="cursor-pointer w-full text-left py-3 px-4 rounded-lg text-indigo-100 hover:bg-white/5 transition flex items-center gap-3">
// 											<Settings className="w-5 h-5" /> Settings
// 										</button>
// 										<button
// 											onClick={handleLogout}
// 											className="cursor-pointer w-full text-left py-3 px-4 rounded-lg text-red-300 hover:bg-red-500/10 transition flex items-center gap-3"
// 										>
// 											<LogOut className="w-5 h-5" /> Sign Out
// 										</button>
// 									</div>
// 								</div>
// 							) : (
// 								<div className="mt-auto">
// 									<Link
// 										to="/login"
// 										className="cursor-pointer block w-full text-center py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-lg"
// 										onClick={() => setIsOpen(false)}
// 									>
// 										Log In / Sign Up
// 									</Link>
// 								</div>
// 							)}
// 						</motion.div>
// 					</>
// 				)}
// 			</AnimatePresence>
// 		</div>
// 	);
// }

// --- 4. MOBILE HAMBURGER MENU (Fixed Background) ---
// export function MobileMenu({ user }) {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const navigate = useNavigate();

// 	const handleLogout = async () => {
// 		setIsOpen(false);
// 		await auth.signOut();
// 		navigate("/login");
// 	};

// 	return (
// 		<div className="md:hidden ml-2">
// 			<button
// 				onClick={() => setIsOpen(true)}
// 				className="cursor-pointer p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition"
// 			>
// 				<Menu className="w-6 h-6" />
// 			</button>

// 			<AnimatePresence>
// 				{isOpen && (
// 					<>
// 						{/* 1. BACKDROP: Dark & Blurry to hide the app behind */}
// 						<motion.div
// 							initial={{ opacity: 0 }}
// 							animate={{ opacity: 1 }}
// 							exit={{ opacity: 0 }}
// 							onClick={() => setIsOpen(false)}
// 							className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
// 						/>

// 						{/* 2. DRAWER: Solid Background #0b0a1f to prevent text bleeding */}
// 						<motion.div
// 							initial={{ x: "100%" }}
// 							animate={{ x: 0 }}
// 							exit={{ x: "100%" }}
// 							transition={{ type: "spring", damping: 25, stiffness: 200 }}
// 							className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-[#0b0a1f] border-l border-white/10 shadow-2xl z-[70] p-6 flex flex-col"
// 						>
// 							{/* Header */}
// 							<div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
// 								<div className="flex items-center gap-2">
// 									<span className="text-2xl">🍿</span>
// 									<span className="text-xl font-bold text-white cinzel tracking-wide">
// 										CineTrack
// 									</span>
// 								</div>
// 								<button
// 									onClick={() => setIsOpen(false)}
// 									className="cursor-pointer p-2 text-indigo-300 hover:bg-white/10 rounded-full transition"
// 								>
// 									<X className="w-6 h-6" />
// 								</button>
// 							</div>

// 							{user ? (
// 								<div className="flex-1 flex flex-col gap-6">
// 									{/* User Profile Card - Solid Slate Background */}
// 									<div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-indigo-500/20 shadow-lg">
// 										<div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full text-white shadow-inner">
// 											<UserRound className="w-6 h-6" />
// 										</div>
// 										<div className="overflow-hidden">
// 											<p className="font-bold text-white text-lg truncate">
// 												{user.displayName || "User"}
// 											</p>
// 											<p className="text-xs text-indigo-300 truncate">
// 												{user.email}
// 											</p>
// 										</div>
// 									</div>

// 									{/* Navigation Links */}
// 									<div className="space-y-2">
// 										<Link
// 											to="/settings"
// 											onClick={() => setIsOpen(false)}
// 											className="group w-full flex items-center gap-4 p-4 rounded-xl text-indigo-100 hover:bg-indigo-600/20 hover:text-white transition-all border border-transparent hover:border-indigo-500/30"
// 										>
// 											<Settings className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
// 											<span className="font-medium">Settings</span>
// 										</Link>

// 										<div className="h-px bg-white/5 my-2" />

// 										<button
// 											onClick={handleLogout}
// 											className="cursor-pointer group w-full flex items-center gap-4 p-4 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all border border-transparent hover:border-red-500/20"
// 										>
// 											<LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
// 											<span className="font-medium">Sign Out</span>
// 										</button>
// 									</div>
// 								</div>
// 							) : (
// 								<div className="mt-auto">
// 									<Link
// 										to="/login"
// 										className="cursor-pointer block w-full text-center py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform"
// 										onClick={() => setIsOpen(false)}
// 									>
// 										Log In / Sign Up
// 									</Link>
// 								</div>
// 							)}

// 							{/* Footer decoration */}
// 							<div className="mt-auto text-center pt-6">
// 								<p className="text-[10px] text-indigo-500/40 uppercase tracking-widest">
// 									CineTrack v1.0
// 								</p>
// 							</div>
// 						</motion.div>
// 					</>
// 				)}
// 			</AnimatePresence>
// 		</div>
// 	);
// }
// --- 4. MOBILE HAMBURGER MENU (Fixed: Scroll Lock) ---
export function MobileMenu({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	// --- LOCK BODY SCROLL WHEN OPEN ---
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"; // Disable scroll
		} else {
			document.body.style.overflow = "unset"; // Re-enable scroll
		}

		// Cleanup: Always re-enable scroll when component unmounts
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleLogout = async () => {
		setIsOpen(false);
		await auth.signOut();
		navigate("/login");
	};

	return (
		<div className="md:hidden ml-2">
			<button
				onClick={() => setIsOpen(true)}
				className="cursor-pointer p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition"
			>
				<Menu className="w-6 h-6" />
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						{/* 1. BACKDROP */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
						/>

						{/* 2. DRAWER */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-[#0b0a1f] border-l border-white/10 shadow-2xl z-[70] p-6 flex flex-col"
						>
							{/* Header */}
							<div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
								<div className="flex items-center gap-2">
									<span className="text-2xl">🍿</span>
									<span className="text-xl font-bold text-white cinzel tracking-wide">
										CineTrack
									</span>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="cursor-pointer p-2 text-indigo-300 hover:bg-white/10 rounded-full transition"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							{user ? (
								<div className="flex-1 flex flex-col gap-6">
									{/* User Profile Card */}
									<div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-indigo-500/20 shadow-lg">
										<div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full text-white shadow-inner">
											<UserRound className="w-6 h-6" />
										</div>
										<div className="overflow-hidden">
											<p className="font-bold text-white text-lg truncate">
												{user.displayName || "User"}
											</p>
											<p className="text-xs text-indigo-300 truncate">
												{user.email}
											</p>
										</div>
									</div>

									{/* Navigation Links */}
									<div className="space-y-2">
										<Link
											to="/settings"
											onClick={() => setIsOpen(false)}
											className="group w-full flex items-center gap-4 p-4 rounded-xl text-indigo-100 hover:bg-indigo-600/20 hover:text-white transition-all border border-transparent hover:border-indigo-500/30"
										>
											<Settings className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
											<span className="font-medium">Settings</span>
										</Link>

										<div className="h-px bg-white/5 my-2" />

										<button
											onClick={handleLogout}
											className="cursor-pointer group w-full flex items-center gap-4 p-4 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all border border-transparent hover:border-red-500/20"
										>
											<LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
											<span className="font-medium">Sign Out</span>
										</button>
									</div>
								</div>
							) : (
								<div className="mt-auto">
									<Link
										to="/login"
										className="cursor-pointer block w-full text-center py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform"
										onClick={() => setIsOpen(false)}
									>
										Log In / Sign Up
									</Link>
								</div>
							)}

							{/* Footer decoration */}
							<div className="mt-auto text-center pt-6">
								<p className="text-[10px] text-indigo-500/40 uppercase tracking-widest">
									CineTrack v1.0
								</p>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
// --- 5. MAIN NAVBAR CONTAINER ---
export function NavBar({ children }) {
	return (
		<nav className="sticky top-0 z-40 bg-[#0f0c29]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3.5 shadow-lg">
			<div className="max-w-[1600px] mx-auto flex items-center justify-between">
				<Logo />
				{children}
			</div>
		</nav>
	);
}

export function NumResults({ query, movies }) {
	if (!query || query.length < 3) return null;

	return (
		<p className="text-indigo-200/80 text-sm font-medium hidden lg:block whitespace-nowrap ml-4">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

export function ErrorMessage({ message }) {
	return (
		<div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
			<span>⛔</span> {message}
		</div>
	);
}
