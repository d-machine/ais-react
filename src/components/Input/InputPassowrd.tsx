import styles from "./Input.module.css"

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  query?: string;
  disabled?: boolean;
  }
  

interface InputPasswordProps {
  id:string;
    field: Field;
    formData: { [key: string]: string | number };
    setFormData: (id:string, name: string, value: string | number) => void
}

export default function InputPassword({id,field, formData,setFormData}:InputPasswordProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(id,e.target.name, e.target.value); 
  };
    return (
        <>
        <label>{field.label}</label>
        <input
          className={styles.input}
          name={field.name}
          value={formData[field.name] || ""}
          style={{ width: "200px" ,gridColumn:"span 10" }}
          type={field.type}
          onChange={handleInputChange}
        />
      </>
    );
}