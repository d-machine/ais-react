import styles from "./Input.module.css"
import { IField } from "./types";


interface InputTextProps {
  id: string;
  field: IField;
  formData: { [key: string]: string | number };
  setFormData: (id: string, name: string, value: string | number) => void
}

export default function InputText({ id, field, formData, setFormData }: InputTextProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(id, e.target.name, e.target.value);
  };

  return (
    <>
      <label>{field.label}</label>
      <input
        className={`${styles.input} ${styles[`input-width-${field.width || 200}`]}`}
        name={field.name}
        value={formData[field.name]}
        type='text'
        onChange={handleInputChange}
      />
    </>
  );
}