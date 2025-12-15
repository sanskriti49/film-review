import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { NavBar } from "../components/Components";
import { User, Save, Download, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import { getWatched } from "../api";

export default function SettingsPage() {
	const { showAlert } = useAlert();
	const navigate = useNavigate();

	//const user = auth.currentUser;
	const [user, setUser] = useState(auth.currentUser);
	const [name, setName] = useState(user?.displayName || "");
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [isExporting, setIsExporting] = useState(false);

	const [loadingAuth, setLoadingAuth] = useState(true); // Add loading state

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				setName(currentUser.displayName || "");
			}
			setLoadingAuth(false);
		});
		return () => unsubscribe();
	}, []);

	if (loadingAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#0f0c29] text-white">
				Loading...
			</div>
		);
	}

	if (!user) {
		navigate("/login");
		return null;
	}

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			await updateProfile(user, { displayName: name });

			const token = await user.getIdToken();
			const res = await fetch(
				`${
					import.meta.env.VITE_API_URL || "http://localhost:5000"
				}/user/profile`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ displayName: name }),
				}
			);
			if (!res.ok) {
				showAlert("Error updating profile ❌", "error");
			}
			showAlert("Profile updated successfully! 🎉", "success");
			setTimeout(() => setMessage(""), 3000);
		} catch (error) {
			setMessage("Error updating profile ❌");
		} finally {
			setIsSaving(false);
		}
	};

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const data = await getWatched();
			const jsonString = JSON.stringify(data, null, 2); //a blob(file-like obj)
			const blob = new Blob([jsonString], { type: "application/json" });

			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;

			const date = new Date().toISOString().split("T")[0];
			link.download = `cinebuzz-data-export-${date}.json`;

			document.body.appendChild(link); //triggers download
			link.click();

			document.body.removeChild(link); // cleanup
			URL.revokeObjectURL(url);

			showAlert("Data exported successfully! 📥", "success");
		} catch (error) {
			console.error("Export failed:", error);
			showAlert("Failed to export data ❌", "error");
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100 font-sans">
			<NavBar>
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate("/")}
						className="cursor-pointer flex items-center gap-2 text-indigo-200 hover:text-white transition"
					>
						<ArrowLeft className="w-5 h-5" /> Back to Dashboard
					</button>
				</div>
			</NavBar>

			<main className="max-w-2xl mx-auto p-6 md:p-12">
				<h1 className="text-3xl font-bold text-white mb-2 cinzel">Settings</h1>
				<p className="text-indigo-200 mb-8">
					Manage your account and preferences.
				</p>

				<div className="space-y-6">
					<div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
						<h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
							<User className="w-5 h-5 text-indigo-400" /> Profile
						</h2>

						<form onSubmit={handleUpdateProfile} className="space-y-4">
							<div>
								<label className="block text-sm text-indigo-200 mb-2">
									Display Name
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition"
								/>
							</div>
							<div>
								<label className="block text-sm text-indigo-200 mb-2">
									Email
								</label>
								<input
									type="text"
									value={user?.email}
									disabled
									className="w-full bg-slate-900/30 border border-white/5 rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed"
								/>
							</div>

							<button
								type="submit"
								disabled={isSaving}
								className="mt-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center gap-2 transition disabled:opacity-50"
							>
								{isSaving ? (
									"Saving..."
								) : (
									<div className="cursor-pointer flex items-center gap-2">
										<Save className="w-4 h-4" /> Save Changes
									</div>
								)}
							</button>

							{message && (
								<p className="text-green-400 text-sm mt-2 animate-pulse">
									{message}
								</p>
							)}
						</form>
					</div>

					<div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
						<h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
							<Download className="w-5 h-5 text-cyan-400" /> Data & Privacy
						</h2>
						<p className="text-sm text-indigo-200 mb-4">
							Download a copy of your watched list for your personal records.
						</p>
						<button
							onClick={handleExport}
							disabled={isExporting}
							className="cursor-pointer px-4 py-2 border border-white/20 rounded-lg text-sm text-indigo-100 hover:bg-white/5 transition flex items-center gap-2 disabled:opacity-50"
						>
							{isExporting ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" /> Exporting...
								</>
							) : (
								<>
									<Download className="w-4 h-4" /> Export Data
								</>
							)}{" "}
						</button>
					</div>

					<div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 backdrop-blur-md">
						<h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
							<Trash2 className="w-5 h-5" /> Danger Zone
						</h2>
						<p className="text-sm text-red-200/70 mb-4">
							Once you delete your account, there is no going back. Please be
							certain.
						</p>
						<button className="cursor-pointer px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition">
							Delete Account
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
