import styles from "./Input.module.css"

// interface IDependencyField {
//   as: string;
//   key: string;
// }

// interface IDependency {
//   dependency: string;
//   fields: IDependencyField[];
// }
// interface IInput {
//   name:string;
//   label:string;
//   type:EInputType;
//   required: boolean;
//   readOnly: boolean;
//   grid_column:string;
//   dependencies?:IDependency[];
//   value?: string;
//   width:number;
//   input_width:number;
// }

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  query?: string;
  disabled?: boolean;
  }
  

interface InputTextProps {
  id:string;
    field: Field;
    formData: { [key: string]: string | number };
    setFormData: (id:string, name: string, value: string | number) => void
}

export default function InputText({id,field, formData,setFormData}:InputTextProps) {
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