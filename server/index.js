import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import admin from "firebase-admin"; // 1. Import Firebase Admin
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json.json");

dotenv.config();

// 2. Initialize Firebase Admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

// --- MIDDLEWARE: Verify Firebase Token ---
// This acts as a security guard. It checks if the user is logged in via Firebase.
const verifyFirebaseToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	const token = authHeader.split(" ")[1];

	try {
		// A. Ask Google: "Is this token valid?"
		const decodedToken = await admin.auth().verifyIdToken(token);
		const { uid, email, name } = decodedToken;

		// B. Sync with Postgres (Ensure user exists in YOUR db)
		// We use the email to find them or create them if they are new.
		let userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);

		if (userResult.rows.length === 0) {
			// User is new! Create them in Postgres automatically.
			userResult = await pool.query(
				"INSERT INTO users (name, email, firebase_uid) VALUES ($1, $2, $3) RETURNING *",
				[name || "User", email, uid]
			);
		}

		// C. Attach the Postgres ID to the request so routes can use it
		req.user = userResult.rows[0];
		next(); // Proceed to the actual route
	} catch (err) {
		console.error("Auth Error:", err);
		return res.status(401).json({ error: "Unauthorized: Invalid token" });
	}
};

// --- ROUTES ---

// 1. RECAPTCHA VERIFICATION (Optional Backend Check)
// If you want to verify captcha on the server side for extra security
app.post("/verify-captcha", async (req, res) => {
	const { token } = req.body;
	const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // Add this to .env

	try {
		const fetch = (await import("node-fetch")).default; // Dynamic import for node-fetch
		const response = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`,
			{
				method: "POST",
			}
		);
		const data = await response.json();

		if (data.success) {
			res.json({ success: true });
		} else {
			res.status(400).json({ success: false, error: "Captcha Failed" });
		}
	} catch (error) {
		res.status(500).json({ error: "Captcha Verification Error" });
	}
});

// 2. Get Movies (Public Route - No Auth Needed)
app.get("/movies", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM movies");
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

// 3. Get Watched (PROTECTED - Needs Token)
// Note: We don't need :user_id in the URL anymore because we know who they are from the token!
app.get("/watched", verifyFirebaseToken, async (req, res) => {
	// req.user.id comes from our middleware
	const user_id = req.user.id;

	try {
		const result = await pool.query("SELECT * FROM watched WHERE user_id=$1", [
			user_id,
		]);
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

// 4. Add Watched (PROTECTED)
app.post("/watched", verifyFirebaseToken, async (req, res) => {
	const user_id = req.user.id;
	const { imdbID, Title, Poster, runtime, imdbRating, userRating } = req.body;

	try {
		const existing = await pool.query(
			"SELECT * FROM watched WHERE user_id=$1 AND imdbid=$2",
			[user_id, imdbID]
		);

		if (existing.rows.length > 0) {
			const updated = await pool.query(
				`UPDATE watched
				 SET title=$1, poster=$2, runtime=$3, imdbrating=$4, userrating=$5
				 WHERE user_id=$6 AND imdbid=$7
				 RETURNING *`,
				[Title, Poster, runtime, imdbRating, userRating, user_id, imdbID]
			);

			return res.json(updated.rows[0]);
		}

		// Insert new record
		const result = await pool.query(
			"INSERT INTO watched (user_id, imdbid, title, poster, runtime, imdbrating, userrating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
			[user_id, imdbID, Title, Poster, runtime, imdbRating, userRating]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

// 5. Recommendations (PROTECTED)
app.get("/recommendations", verifyFirebaseToken, async (req, res) => {
	const user_id = req.user.id;

	try {
		const watchedResult = await pool.query(
			"SELECT * FROM watched WHERE user_id=$1",
			[user_id]
		);
		const moviesResult = await pool.query("SELECT * FROM movies");

		const watchedIds = watchedResult.rows.map((movie) => movie.imdbid);

		const recommended = moviesResult.rows
			.filter((movie) => !watchedIds.includes(movie.imdbid))
			.sort((a, b) => b.imdbrating - a.imdbrating)
			.slice(0, 5);

		res.json(recommended);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal sever error" });
	}
});

app.delete("/watched/:imdbID", verifyFirebaseToken, async (req, res) => {
	const user_id = req.user.id;
	const { imdbID } = req.params;

	try {
		const result = await pool.query(
			"DELETE FROM watched WHERE user_id=$1 and imdbid=$2 RETURNING *",
			[user_id, imdbID]
		);
		res.json({ deleted: result.rows[0] });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

// 6. Update User Profile (PROTECTED)
app.put("/user/profile", verifyFirebaseToken, async (req, res) => {
	const user_id = req.user.id; // From Postgres
	const { displayName } = req.body;

	try {
		const result = await pool.query(
			"UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
			[displayName, user_id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Server error updating profile" });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
