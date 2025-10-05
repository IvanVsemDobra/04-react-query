import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const validationSchema = Yup.object({
  query: Yup.string()
    .min(2, "Enter at least 2 characters")
    .required("Search query is required"),
});

export function SearchBar({ onSubmit }: SearchBarProps) {
  return (
    <Formik
      initialValues={{ query: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values.query);
        resetForm();
      }}
    >
      {() => (
        <Form className={styles.form}>
          <Field
            type="text"
            name="query"
            placeholder="Search for a movie..."
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Search
          </button>
          <FormikError name="query" component="div" className={styles.error} />
        </Form>
      )}
    </Formik>
  );
}
