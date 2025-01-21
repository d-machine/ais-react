import { EButtonType, EInputType } from "./types";
import InputSelect from "./InputSelect";
import InputText from "./InputText";
import InputDate from "./InputDate";
import InputButton from "./InputButton";
import styles from "./Input.module.css"

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
  

interface InputProps{
    id:string;
    fields:IInput[];
    formData: { [key: string]: string | number };
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (id: string,name: string, value: { id: string | number; name: string }) => void;
    setFormData: (id:string,name: string, value: string | number) => void;
}

const INPUT_MAP = {
    [EInputType.TEXT]: InputText,
    [EInputType.DATE]: InputDate,
    [EInputType.SELECT]: InputSelect,
    [EInputType.BUTTON]:InputButton,
    [EInputType.TEXTFIELD]:InputText
  } ;
export default function Form({id,fields, formData,selectedValues,setSelectedValues,setFormData}:InputProps){
    return (
        <div className={styles.parent}>
        {
            fields.map((field) => {
                const INPUT = INPUT_MAP[field.type];
               return (
                    <div key={field.name} className={styles.child} style={{ gridColumn: field.grid_column }}>
                        <INPUT 
                        formId={id}
                          key={field.name} 
                          field={field} 
                          formData={formData}
                          selectedValues={selectedValues}
                          setFormData={setFormData}
                          setSelectedValues={setSelectedValues}
                        />
                    </div>
                )
            }
                )
          }
        </div>
    );
}

