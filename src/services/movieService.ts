import type { Movie } from "../types/movie";
import axios, { AxiosError } from "axios";
import * as yup from "yup";

// ---  для "сирої" відповіді TMDb API ---
interface TMDbMoviesResponse {
  results: Array<{
    id: number;
    title: string;
    overview?: string | null;
    release_date?: string | null;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number | null;
  }>;
  total_results: number;
  total_pages: number;
}

interface MoviesResult {
  results: Movie[];
  total_results: number;
  total_pages: number;
}

interface TMDbErrorResponse {
  status_message?: string;
  status_code?: number;
}

// --- Yup-схеми ---
const movieSchema = yup.object({
  id: yup.number().required(),
  title: yup.string().required(),
  overview: yup.string().nullable(),
  release_date: yup.string().nullable(),
  poster_path: yup.string().nullable(),
  backdrop_path: yup.string().nullable(),
  vote_average: yup.number().nullable(),
});

const moviesResponseSchema = yup.object({
  results: yup.array().of(movieSchema).required(),
  total_results: yup.number().required(),
  total_pages: yup.number().required(),
});

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResult> {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error(
      "VITE_TMDB_TOKEN не знайдено. Додай токен у .env і не коміть цей файл."
    );
  }

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&page=${page}`;

  try {
    //  явний дженерик <TMDbMoviesResponse>
    const res = await axios.get<TMDbMoviesResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    // Валідація структури відповіді через Yup
    const validatedData = (await moviesResponseSchema.validate(res.data, {
      abortEarly: false,
      stripUnknown: true,
    })) as yup.InferType<typeof moviesResponseSchema>;

    // Нормалізація даних під тип Movie
    const normalizedResults: Movie[] = validatedData.results.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview ?? "",
      release_date: m.release_date ?? "",
      poster_path: m.poster_path ?? "",
      backdrop_path: m.backdrop_path ?? "",
      vote_average: m.vote_average ?? 0,
    }));

    return {
      results: normalizedResults,
      total_results: validatedData.total_results,
      total_pages: Math.min(validatedData.total_pages, 500), // TMDB максимум 500
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<TMDbErrorResponse>;
      const message =
        axiosError.response?.data?.status_message ??
        axiosError.message ??
        "Помилка при запиті до TMDb API.";
      throw new Error(`Помилка отримання фільмів: ${message}`);
    }

    if (error instanceof yup.ValidationError) {
      throw new Error("Некоректна структура відповіді від TMDb API.");
    }

    throw new Error("Невідома помилка при отриманні фільмів.");
  }
}
