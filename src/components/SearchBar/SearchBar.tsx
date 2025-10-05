import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const initialValues = { query: "" };

  const validationSchema = Yup.object({
    query: Yup.string().required("Please enter your search query."),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values.query);
        resetForm();
      }}
    >
      {() => (
        <Form className={styles.form}>
          <Field
            className={styles.input}
            name="query"
            placeholder="Search movies..."
            autoComplete="off"
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
          <FormikError name="query" component="div" className={styles.error} />
        </Form>
      )}
    </Formik>
  );
};
