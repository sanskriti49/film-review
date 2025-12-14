from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load preprocessed data / features / similarity matrix
features_matrix = pd.read_pickle("features_matrix.pkl")  # your processed movie features
cosine_sim_df = pd.read_pickle("cosine_sim.pkl")  # precomputed similarity matrix
movie_titles = pd.read_pickle("movie_features_df.pkl")[['title']]

import pandas as pd

# Load ratings data
ratings_df = pd.read_csv(
    r"C:\Users\sansk\Downloads\React course\popcorn\ml-100k\u.data",
    sep='\t',
    names=['user_id', 'movie_id', 'rating', 'timestamp']
)

# Load movie titles/features
movie_features_df = pd.read_csv(
    r"C:\Users\sansk\Downloads\React course\popcorn\ml-100k\u.item",
    sep='|', 
    header=None,
    encoding='latin-1'
)
movie_features_df.columns = [
    'movie_id', 'title', 'release_date', 'video_release_date', 'IMDb_URL',
    'unknown','Action','Adventure','Animation','Children','Comedy','Crime',
    'Documentary','Drama','Fantasy','Film-Noir','Horror','Musical','Mystery',
    'Romance','Sci-Fi','Thriller','War','Western'
]


def get_trending_movies(top_n=10, min_ratings=20):
    """
    Returns top_n trending movies based on average rating and minimum ratings threshold
    """
    # Compute avg rating and number of ratings per movie
    stats = ratings_df.groupby('movie_id')['rating'].agg(['mean','count'])
    
    # Filter movies with at least min_ratings ratings
    stats = stats[stats['count'] >= min_ratings]
    
    # Sort by highest average rating
    top_movies_ids = stats.sort_values('mean', ascending=False).head(top_n).index
    
    # Return movie titles
    return movie_features_df.set_index('movie_id').loc[top_movies_ids]['title'].tolist()
print(get_trending_movies(top_n=5))
# Output: ['Shawshank Redemption, The (1994)', 'Star Wars (1977)', ...]


def recommend_for_user(user_id, top_n=5):
    # Fetch user's watched movies from PostgreSQL or a CSV

    watched_movies = ratings_df[ratings_df.user_id == user_id]['movie_id'].tolist()

    if not watched_movies:
        # User hasn't watched anything: return top-rated movies
        top_movies = ratings_df.groupby('movie_id')['rating'].mean().sort_values(ascending=False).head(top_n).index
        return movie_titles.loc[top_movies]['title'].tolist()
    
    # Compute average similarity to watched movies
    sim_scores_all = cosine_sim_df[watched_movies].mean(axis=1)
    sim_scores_all = sim_scores_all.drop(watched_movies, errors='ignore')
    top_movies = sim_scores_all.sort_values(ascending=False).head(top_n).index
    return movie_titles.loc[top_movies]['title'].tolist()

@app.route('/recommendations/<int:user_id>', methods=['GET'])
def recommendations(user_id):
    top_movies_titles = recommend_for_user(user_id)
    movies_list = [{"title": t} for t in top_movies_titles]
    return jsonify(movies_list)

@app.route('/trending', methods=['GET'])
def trending():
    top_movies_titles= get_trending_movies(top_n=10)
    movies_list = [{"title":t} for t in top_movies_titles]
    return jsonify(movies_list)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
