import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import { Loader } from "../Loader/Loader";
import { useMemo } from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData, //  щоб не було "блимань"
  });

  const movies = useMemo(() => data?.movies ?? [], [data?.movies]);
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handlePageChange = (selected: { selected: number }) => {
    setPage(selected.selected + 1);
  };
  // Тости через useEffect
  useEffect(() => {
    if (!isLoading && !isError && query && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isLoading, isError, query, movies]);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong. Try again later.");
    }
  }, [isError]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      {(isLoading || isFetching) && <Loader />}
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
