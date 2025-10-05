import type { Movie } from "../types/movie";

interface MoviesResult {
  movies: Movie[];
  totalResults: number;
  totalPages: number;
}

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResult> {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&page=${page}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch movies");

  const data = await res.json();

  return {
    movies: data.results,
    totalResults: data.total_results,
    totalPages: Math.min(data.total_pages, 500), // TMDB максимум 500
  };
}
