import { EInputType } from "./types";
import InputSelect from "./InputSelect";
import InputText from "./InputText";
import InputDate from "./InputDate";
import InputButton from "./InputButton";
import styles from "../EntryForm/EntryForm.module.css"

interface DependencyField{
    as: string;
    key: string;
}

interface Dependency{
    dependency: string;
    fields: DependencyField[];
}

interface Field{
    name:string;
    type:EInputType;
    label:string;
    grid_column:string;
    dependencies:Dependency[];
    select_query: string;
    to_show: string;
    width:number;
    input_width:number;
};  

interface InputProps{
    fields:Field[];
    formData: { [key: string]: string | number };
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (name: string, value: { id: string | number; name: string }) => void;
    setFormData: (name: string, value: string | number) => void;
}

const INPUT_MAP = {
    [EInputType.TEXT]: InputText,
    [EInputType.DATE]: InputDate,
    [EInputType.SELECT]: InputSelect,
    [EInputType.BUTTON]:InputButton
  } ;
  


export default function Form({fields, formData,selectedValues,setSelectedValues,setFormData}:InputProps){
    return (
        <div className={styles.parent}>
        {
            fields.map((field) => {

                const INPUT = INPUT_MAP[field.type];
               return (
                    <div key={field.name} className={styles.child} style={{ gridColumn: field.grid_column }}>
                        <INPUT 
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

