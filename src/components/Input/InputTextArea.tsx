import styles from "./Input.module.css"

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  query?: string;
  disabled?: boolean;
  }
  

interface InputTextArea {
  id:string;
    field: Field;
    formData: { [key: string]: string | number };
    setFormData: (id:string, name: string, value: string | number) => void
}

export default function InputTextArea({id,field, formData,setFormData}:InputTextArea) {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(id, e.target.name, e.target.value);
      };
    return (
        <>
        <label>{field.label}</label>
        <textarea
          className={styles.textarea}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleInputChange}
        >
            {formData[field.name]}
        </textarea>
      </>
    );
}