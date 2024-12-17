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

interface InputDateProps {
    field: Field;
    formData: { [key: string]: string | number };
    setFormData: (name: string, value: string | number) => void;
}


export default function InputDate({field, formData,setFormData}:InputDateProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(e.target.name, e.target.value); 
  };
  
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