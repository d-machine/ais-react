import styles from "../EntryForm/EntryForm.module.css";
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
  field: IInput;
}

export default function InputButton({ field }: InputButtonProps) {
  return (
    <input type="button"
    value={field.value}
      className={styles.input}
      style={{ width: field.input_width, textAlign: "center" }}
    />
  );
}
