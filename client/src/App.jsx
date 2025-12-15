import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { onAuthStateChanged } from "firebase/auth";
import { BeatLoader } from "react-spinners";
import { auth } from "./firebase";
import SettingsPage from "./pages/SettingsPage";
import { AlertProvider } from "./contexts/AlertContext";

export default function App() {
	const [user, setUser] = useState(null);
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		// this listener fires whenever the user logs in, logs out, or the app refreshes
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setIsFetching(false);
		});
		return () => unsubscribe();
	}, []);

	if (isFetching) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0f0c29]">
				<BeatLoader color="#818cf8" />
			</div>
		);
	}

	return (
		<AlertProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={!user ? <AuthPage /> : <Navigate to="/" replace />}
					/>

					<Route
						path="/"
						element={
							user ? (
								<Dashboard user={user} />
							) : (
								<Navigate to="/login" replace />
							)
						}
					/>
					<Route
						path="/settings"
						element={user ? <SettingsPage /> : <Navigate to="/login" replace />}
					/>
				</Routes>
			</BrowserRouter>
		</AlertProvider>
	);
}
