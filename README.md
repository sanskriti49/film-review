# 🍿 CineBuzz

CineBuzz is a full-stack movie tracking and review application that allows users to build a personal library of watched films. Users can search for movies, rate them, analyze their viewing habits, and get recommendations — all wrapped in a modern, responsive, cinema-dark UI.

---

## ✨ Features

* **Authentication**

  * Secure Login & Signup using **Firebase Authentication**
  * Email & Password auth with **reCAPTCHA protection**

* **Movie Search**

  * Real-time movie search using **OMDb API**
  * Posters, trending movies, and recommendations via **TMDB API**

* **Personal Library**

  * Add movies to a personal **Watched List**
  * Persistent storage across devices

* **Rating System**

  * Rate movies individually
  * Compare your rating with IMDb ratings

* **Dashboard Analytics**

  * Total movies watched
  * Total runtime
  * Average user rating

* **User Profile**

  * Update display name
  * Manage account settings

* **Responsive Design**

  * Fully mobile-responsive layout
  * Custom hamburger menu with smooth animations

* **Backend Sync**

  * All user and movie data persisted in **PostgreSQL**

---

## 🛠️ Tech Stack

### Frontend

* **React.js** (Vite)
* **Tailwind CSS** (Styling)
* **Framer Motion** (Animations)
* **Lucide React** (Icons)
* **Firebase Auth** (Client SDK)

### Backend

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **Firebase Admin SDK** (Token verification)

### APIs

* **OMDb API** – Movie metadata
* **TMDB API** – Posters, trending movies, recommendations

---

## 🚀 Getting Started

Follow the steps below to run CineBuzz locally.

---

## ✅ Prerequisites

* Node.js **v16+**
* PostgreSQL (installed & running)
* Firebase Project (for authentication)
* OMDb API Key
* TMDB API Key

---

## 📦 1. Clone the Repository

```bash
git clone https://github.com/sanskriti49/film-review.git
cd film-review
```

---

## 🗄️ 2. Database Setup (PostgreSQL)

Create a database (e.g., `film_review`) and run the following SQL:

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Watched Movies Table

```sql
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

---

## 🧠 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=film_review
RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret
```

### Firebase Admin Setup

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Download `serviceAccountKey.json`
3. Place it inside the `server` folder
4. Add it to `.gitignore`

---

## 🎨 4. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Configure Firebase inside `src/firebase.js` using your Firebase project credentials.

---

## 🏃‍♂️ Running the App

### Start Backend

```bash
cd server
npm start
# or
node index.js
```

### Start Frontend

```bash
cd client
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🛡️ Security

* **Firebase Token Verification**

  * Every request is authenticated via Firebase Admin SDK
* **Environment Variables**

  * All secrets stored securely in `.env` files
  * No sensitive data committed to version control

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit changes

   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push to branch

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**.
See `LICENSE` for more information.

---
