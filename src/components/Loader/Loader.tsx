import { RotatingSquare } from "react-loader-spinner";
import styles from "./Loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <RotatingSquare
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="loading-movies"
      />
      <p className={styles.text}>Loading movies, please wait...</p>
    </div>
  );
};
