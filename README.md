🍿 CineBuzz
CineBuzz is a full-stack movie tracking application that allows users to build a personal library of watched films. Users can search for movies, rate them, view detailed statistics about their viewing habits, and get recommendations. It features a modern, responsive "Glassmorphism" UI with a cinema-dark theme.

✨ Features
Authentication: Secure Login/Signup via Firebase (Email & Password) with ReCAPTCHA protection.

Movie Search: Real-time search using the OMDb API and TMDB API.

Personal Library: Add movies to your "Watched" list.

Rating System: Rate movies and compare your score with IMDb ratings.

Dashboard Analytics: View stats like total movies watched, total runtime, and average user rating.

Responsive Design: Fully mobile-responsive with a custom hamburger menu and animations.

User Profile: Update display name and manage account settings.

Backend Sync: All data is persisted in a PostgreSQL database.

🛠️ Tech Stack
Frontend:

React.js (Vite)

Tailwind CSS (Styling)

Framer Motion (Animations)

Lucide React (Icons)

Firebase Auth (Client SDK)

Backend:

Node.js & Express.js

PostgreSQL (Database)

Firebase Admin SDK (Server-side Token Verification)

APIs:

OMDb API (Primary movie data)

TMDB API (Posters, Trending, and Recommendations)

🚀 Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v16 or higher)

PostgreSQL installed and running

A Firebase Project (for Auth)

API Keys for OMDb and TMDB

1. Clone the Repository
Bash

```[git clone (https://github.com/sanskriti49/film-review)]```
```cd film-review```

2. Database Setup (PostgreSQL)
Create a database (e.g., film_review) and run the following SQL commands to create the necessary tables:

SQL

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```
CREATE TABLE watched (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    imdbid VARCHAR(20),
    title VARCHAR(255),
    poster TEXT,
    runtime INTEGER,
    imdbrating NUMERIC(3,1),
    userrating NUMERIC(3,1),
    count_rating_decisions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Backend Setup
Navigate to the server folder (or root if combined):

Install dependencies:

Bash

cd server
npm install
Create a .env file in the server folder:

Code snippet

```PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=film_review
RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret
```

Add your Firebase Service Account Key:

Download serviceAccountKey.json from Firebase Project Settings > Service Accounts.

Place it in the server folder (ensure this file is in your .gitignore).

4. Frontend Setup
Navigate to the client folder:

Install dependencies:

Bash
```
cd client
npm install
```

Create a .env file in the client folder:

Code snippet
```
VITE_API_URL=http://localhost:5000
VITE_TMDB_API_KEY=your_tmdb_api_key
Configure Firebase in src/firebase.js using your project credentials.
```

🏃‍♂️ Running the App
Start the Backend Server:

Bash

# In the server terminal
```npm start```
# or
```node index.js```
Start the Frontend:

Bash

# In the client terminal
```npm run dev```
Open http://localhost:5173 to view it in the browser.

📸 Screenshots
(Add screenshots of your Dashboard, Login Page, and Mobile Menu here)

🛡️ Security
Firebase Tokens: The backend verifies the identity of every request using the Firebase Admin SDK middleware.

Environment Variables: Sensitive keys (Database passwords, API secrets) are stored in .env files and not committed to version control.

🤝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
