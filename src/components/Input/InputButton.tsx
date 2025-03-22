import { useStore } from "../../store";
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

interface InputButtonProps {
  id: string;
  field: IInput;
}

export default function InputButton({id, field }: InputButtonProps) {

  const storeData = useStore((state) => state.entries[id].metadata);
  const handleClick=()=>{

    
    switch (field.buttonType) {
      case EButtonType.ADD:
          console.log(storeData, "storeData");
          
        break;
    
      default:
        break;
    }
  }
  return (
    <input type="button"
    value={field.value}
    onClick={handleClick}
      className={styles.input}
      style={{ width: field.input_width, textAlign: "center" }}
    />
  );
}
