import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Mail,
	Lock,
	ArrowRight,
	AlertCircle,
	Loader2,
} from "lucide-react";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion"; // Make sure this is imported
import ReCAPTCHA from "react-google-recaptcha";
import { useAlert } from "../contexts/AlertContext";

export default function AuthPage({ setIsAuthenticated }) {
	const { showAlert } = useAlert();

	const [isLogin, setIsLogin] = useState(true);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [captchaToken, setCaptchaToken] = useState(null);
	const recaptchaRef = useRef(null);

	const navigate = useNavigate();

	const handleGoogleLogin = async () => {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
		} catch (err) {
			console.error(err);
			showAlert("Google Sign-In Failed", "error");
		}
	};

	const handleAuth = async (e) => {
		e.preventDefault();

		if (!isLogin && !captchaToken) {
			setError("Please verify you are not a robot.");
			return;
		}
		setLoading(true);
		try {
			if (isLogin) {
				await signInWithEmailAndPassword(auth, email, password);
			} else {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await updateProfile(userCredential.user, { displayName: name });
			}
			navigate("/");
			showAlert("Successfully logged in!", "success");
		} catch (err) {
			const errorCode = err.code.replace("auth/", "").replace(/-/g, " ");
			const formattedError =
				errorCode.charAt(0).toUpperCase() + errorCode.slice(1);
			setError(formattedError);
			showAlert(formattedError, "error");

			if (!isLogin) {
				recaptchaRef.current.reset();
				setCaptchaToken(null);
			}
		} finally {
			setLoading(false);
		}
	};

	const onCaptchaChange = (token) => {
		setCaptchaToken(token);
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center p-6 relative">
			<div className="fixed inset-0 -z-10 bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"></div>

			<div className="relative w-full max-w-md">
				{/* Decorative Glow */}
				<div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px]" />
				<div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-[100px]" />

				<div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 overflow-hidden">
					<div className="text-center mb-8">
						<div className="flex items-center justify-center gap-2 mb-2">
							<span className="text-4xl">🍿</span>
							<h1 className="text-3xl font-bold cinzel text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
								CineBuzz
							</h1>
						</div>
						<p className="text-indigo-200/80 font-medium text-sm font-raleway tracking-wide">
							{isLogin
								? "Welcome back to your collection"
								: "Start your cinema journey"}
						</p>
					</div>

					<form onSubmit={handleAuth} className="space-y-5">
						{!isLogin && (
							<div className="relative group">
								<User className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
								<input
									type="text"
									placeholder="Full Name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
								/>
							</div>
						)}

						<div className="relative group">
							<Mail className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
							<input
								type="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
							/>
						</div>

						<div className="relative group">
							<Lock className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
							<input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
							/>
						</div>
						{!isLogin && (
							<div className="flex justify-center transform scale-90">
								<ReCAPTCHA
									ref={recaptchaRef}
									sitekey="6LeUXyssAAAAAJUTP7uP6tsm0xO6g18T2Vi5FF4A"
									onChange={onCaptchaChange}
									theme="dark"
								/>
							</div>
						)}
						{error && (
							<div className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
								<AlertCircle className="w-4 h-4" /> {error}
							</div>
						)}

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={loading}
							className="relative group w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] bg-left hover:bg-right transition-all duration-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 border border-white/10 overflow-hidden"
						>
							<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
							<div className="cursor-pointer relative flex items-center justify-center gap-2">
								{loading ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										<span>Processing...</span>
									</>
								) : (
									<>
										<span>{isLogin ? "Sign In" : "Create Account"}</span>
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</>
								)}
							</div>
						</motion.button>
					</form>

					<div className="flex items-center gap-4 my-6">
						<div className="h-px flex-1 bg-white/20"></div>
						<span className="text-xs text-indigo-200/50 font-semibold uppercase tracking-widest">
							Or continue with
						</span>
						<div className="h-px flex-1 bg-white/20"></div>
					</div>

					<motion.button
						whileHover={{
							scale: 1.01,
							backgroundColor: "rgba(255,255,255,0.08)",
						}}
						whileTap={{ scale: 0.98 }}
						onClick={handleGoogleLogin}
						className="cursor-pointer w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white font-semibold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-black/10"
					>
						<img
							src="https://www.svgrepo.com/show/475656/google-color.svg"
							alt="Google"
							className="w-5 h-5"
						/>
						<span>Sign in with Google</span>
					</motion.button>

					<div className="mt-6 text-center">
						<p className="text-base font-medium text-slate-400">
							{isLogin ? "Need an account? " : "Have an account? "}
							<button
								onClick={() => setIsLogin(!isLogin)}
								className="cursor-pointer text-cyan-300 font-semibold hover:text-cyan-200 hover:underline transition-colors"
							>
								{isLogin ? "Sign Up" : "Log In"}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
