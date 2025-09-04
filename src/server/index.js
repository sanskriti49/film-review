import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "movies_db",
	password: "SANSKWERTY",
	port: 5432,
});

app.get("/movies", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM movies");
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/watched/:user_id", async (req, res) => {
	const { user_id } = req.params;
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
app.get("/recommendations/:user_id", async (req, res) => {
	const { user_id } = req.params;

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
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running onn port ${PORT}`));
