import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { RotatingSquare } from "react-loader-spinner";
import { SearchBar } from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  const movies = data?.movies ?? [];
  const totalResults = data?.totalResults ?? 0;
  const totalPages = Math.ceil(totalResults / 10);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handlePageChange = (selected: { selected: number }) => {
    setPage(selected.selected + 1);
  };

  // тости через useEffect
  useEffect(() => {
    if (!isLoading && !isError && query && totalResults === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isLoading, isError, query, totalResults]);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong. Try again later.");
    }
  }, [isError]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {(isLoading || isFetching) && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <RotatingSquare
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="rotating-square-loading"
          />
        </div>
      )}

      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            previousLabel="<"
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            pageCount={totalPages}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.activePage}
          />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
