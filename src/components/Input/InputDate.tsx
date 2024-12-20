import styles from "./Input.module.css"
import { EButtonType, EInputType } from "./types";

interface IDependencyField {
  as: string;
  key: string;
}

interface IDependency {
  dependency: string;
  fields: IDependencyField[];
}
interface IInput {
  name:string;
  label:string;
  type:EInputType;
  required: boolean;
  readOnly: boolean;
  grid_column:string;
  dependencies?:IDependency[];
  selectQuery?: string;
  buttonType?: EButtonType;
  value?: string;
  width:number;
  input_width:number;
}

interface InputDateProps { 
  id:string,
    field: IInput;
    formData: { [key: string]: string | number };
    setFormData: (id:string,name: string, value: string | number) => void;
}


export default function InputDate({id,field, formData,setFormData}:InputDateProps) {
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
          style={{ width: field.input_width }}
          type={field.type}
          onChange={handleInputChange}
        />
      </>
    );
}