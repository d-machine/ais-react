import styles from "../EntryForm/EntryForm.module.css"

interface Field {
    name:string;
    type:string;
    label:string;
    grid_column:string;
    select_query: string;
    to_show: string;
    width:number;
    input_width:number;
  }

interface InputTextProps {
    field: Field;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formData: { [key: string]: string | number };
}

export default function InputText({field,handleInputChange, formData}:InputTextProps) {
    return (
        <>
        <label>{field.label}</label>
        <input
          className={styles.input}
          name={field.name}
          value={formData[field.name] || ""}
          style={{ width: field.input_width }}
          type={field.type}
          onChange={handleInputChange}
        />
      </>
    );
}