
import InputSelect from "./InputSelect";
import InputText from "./InputText";
import styles from "./Input.module.css"

// interface IDependencyField {
//     as: string;
//     key: string;
//   }
  
//   interface IDependency {
//     dependency: string;
//     fields: IDependencyField[];
//   }
//   interface IInput {
//     name:string;
//     label:string;
//     type:EInputType;
//     required: boolean;
//     readOnly: boolean;
//     grid_column:string;
//     dependencies?:IDependency[];
//     selectQuery?: string;
//     buttonType?: EButtonType;
//     value?: string;
//     width:number;
//     input_width:number;
//   }
  


interface Field {
name: string;
label: string;
type: string;
required?: boolean;
query?: string;
disabled?: boolean;
}



interface InputProps{
    formId:string;
    fields:Field[];
    formData: { [key: string]: string | number };
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (id: string,name: string, value: { id: string | number; name: string }) => void;
    setFormData: (id:string,name: string, value: string | number) => void;
}

export default function Form({formId,fields,formData,selectedValues,setSelectedValues,setFormData}:InputProps){
    return (
        <div className={styles.parent}>
        {
            fields.map((field) => {
               return (
                    <div key={field.name} className={styles.child} style={{ gridColumn:"span 20"}}>
                      {field.type==="TEXT" || field.type=="TEXTAREA"?(
                          <InputText 
                          id={formId}
                            key={field.name} 
                            field={field} 
                            formData={formData}
                            setFormData={setFormData}
                          />
                      ):field.type==="SELECT"?(
                        <InputSelect 
                          formid={formId}
                            key={field.name} 
                            field={field} 
                            formData={formData}
                            selectedValues={selectedValues}
                            setFormData={setFormData}
                            setSelectedValues={setSelectedValues}
                          />
                      ):null}
                    </div>
                )
            }
                )
          }
        </div>
    );
}

