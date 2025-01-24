
//import InputSelect from "./InputSelect";
import styles1 from "../Users/user.module.css";
import InputText from "./InputText";
import styles from "./Input.module.css"
import InputPassword from "./InputPassowrd";
import InputSelect from "./InputSelect";
import InputTextArea from "./InputTextArea";
import { EFieldType } from "./types";

interface Section {
  sectionType: string;
  sectionName: string;
  queryReturnType: string;
  query: string;
  payload: string[];
  applicableActions: string[];
  actionConfig: ActionConfig;
  fields?: Field[];
  columns?: Column[];
}
interface ActionConfig {
  [key: string]: Action;
}

interface Action {
  label: string;
  actionType: string;
  query?: string;
  queryReturnType?: string;
  payload?: string[];
  contextParams?: string[];
  functionName?: string;
  onSuccess?: string;
  onFailure?: string;
}

interface Field {
  name: string;
  label: string;
  type: EFieldType;
  required?: boolean;
  query?: string;
  disabled?: boolean;
}

interface Column {
  name: string;
  label: string;
  type: string;
  multi?: boolean;
  selectConfig?: SelectConfig;
}

interface SelectConfig {
  selectHandler: string;
  currentSelection: Selection[];
  selectParser: string;
  columns: { id: string; name: string };
  options: Option[];
  fields_to_extract: Selection[];
}

interface Selection {
  key: string;
  as: string;
}

interface Option {
  id: string;
  name: string;
}


const INPUT_MAP = {
  [EFieldType.PASSWORD]: InputPassword,
  [EFieldType.TEXT]: InputText,
  [EFieldType.text]: InputText,
  [EFieldType.SELECT]: InputSelect,
  [EFieldType.TEXTAREA]: InputTextArea,
};

interface InputProps{
    formId:string;
    section:Section;
    formData: { [key: string]: string | number };
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (id: string,name: string, value: { id: string | number; name: string }) => void;
    setFormData: (id:string,name: string, value: string | number) => void;
}

export default function Form({formId,section,formData,selectedValues,setSelectedValues,setFormData}:InputProps){
    return (
      <>
        <h2>{section.sectionName}</h2>
        <div className={styles.parent}>
        {
            section.fields?.map((field) => {
              const InputComponent = INPUT_MAP[field.type];
              return (
                <div key={field.name}  
                className={styles.child} 
                style={{ gridColumn:"span 20",border:"2px red solid",gap:"10px"}}>
                <InputComponent
                key={field.name}
                id={formId}
                field={field}
                formData={formData}
                setFormData={setFormData}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
              />
                  </div>
                )
            }
                )
              }
        </div>
        <div className={styles1.buttonContainer}>
              {section.applicableActions.map((actionKey, index) => {
                const action = section.actionConfig[actionKey as keyof typeof section.actionConfig];
                return (
                  <button
                    key={index}
                    className={styles1.actionButton}
                    onClick={() => {
                      if (action.onSuccess === "exitAndComplete") {
                        console.log("Exiting and completing...");
                      } else if (action.onFailure === "showErrorSnackbar") {
                        console.error("Error encountered.");
                      } else {
                        console.log(`Executing action: ${action.label}`);
                      }
                    }}
                    >
                    { action.label }
                  </button>
                );
              })}
      </div>
        </>
    );
}

