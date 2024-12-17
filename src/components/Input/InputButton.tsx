import styles from "../EntryForm/EntryForm.module.css";

interface Field {
  name: string;
  type: string;
  label: string;
  grid_column: string;
  select_query: string;
  to_show: string;
  width: number;
  input_width: number;
}

interface InputButtonProps {
  field: Field;
}

export default function InputButton({ field }: InputButtonProps) {
  return (
    <input type="button"
    value={field.label}
      className={styles.input}
      style={{ width: field.input_width, textAlign: "center" }}
    />
  );
}
