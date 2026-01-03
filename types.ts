
export interface UserProfile {
  id: string;
  name: string;
  preferredGenres: string[];
  dislikedGenres: string[];
  favoriteMovies: string[];
  favoriteActors: string[];
}

export interface Recommendation {
  title: string;
  year: string;
  posterUrl: string;
  score: number;
  matchExplanation: string;
  streamingOn: string[];
  genres: string[];
  runtime: string;
  imdbRating: string;
  director: string;
  topCast: string[];
  type: 'Movie' | 'Series' | 'TV Show';
  trailerUrl: string;
}

export interface AppState {
  users: UserProfile[];
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
}
