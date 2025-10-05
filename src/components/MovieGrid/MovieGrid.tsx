import type { Movie } from "../../types/movie";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

// Базовий URL для постерів TMDB
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const PLACEHOLDER = "/public/placeholder.svg";

export const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  if (!movies.length) return null;

  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div className={styles.card} onClick={() => onSelect(movie)}>
            <img
              className={styles.image}
              // Якщо poster_path є → формуємо URL, інакше одразу заглушка
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : PLACEHOLDER
              }
              alt={movie.title}
              loading="lazy"
              // Якщо картинка не підвантажилась → замінюємо на заглушку
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
            <h2 className={styles.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};
