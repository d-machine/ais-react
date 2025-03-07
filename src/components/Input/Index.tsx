
//import InputSelect from "./InputSelect";
import styles1 from "../Users/user.module.css";
import InputText from "./InputText";
import styles from "./Input.module.css"
import InputPassword from "./InputPassowrd";
import InputSelect from "./InputSelect";
import InputTextArea from "./InputTextArea";
import { EFieldType } from "./types";
import { useAddStore } from "../../useAddStore";
import { postApiCall } from "../../api/base";


const INPUT_MAP = {
  [EFieldType.PASSWORD]: InputPassword,
  [EFieldType.TEXT]: InputText,
  [EFieldType.text]: InputText,
  [EFieldType.SELECT]: InputSelect,
  [EFieldType.TEXTAREA]: InputTextArea,
};

interface InputProps{
  configFile:string;
    formId:string;
    section:any;
    setIsModalOpen: (value: boolean) => void;
    formData: { [key: string]: string | number };
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (id: string,name: string, value: { id: string | number; name: string }) => void;
    setFormData: (id:string,name: string, value: string | number) => void;
}


export default function Form({configFile ,formId,section,formData,selectedValues,setSelectedValues,setFormData,setIsModalOpen}:InputProps){
    const {entries} = useAddStore();

    const handleOnClick = async (actionKey: string) => {
      console.log(section);
      console.log(entries[formId].metadata);
      console.log(configFile);
      
      const action = section.actionConfig[actionKey];
      console.log(action.queryInfo.path);
      
      
      if (!action || action.actionType !== "EXECUTE_QUERY") return;
      // @ts-expect-error as we are not using all the fields
      const payload = action.queryInfo.payload?.map(key => entries[formId].metadata[key] ?? "undefined") || [];
      console.log("Payload:", payload);
      try {
          
          const response = await postApiCall(
              "api/generic/executeQuery",
              {
                  configFile,
                  fetchquery: action.queryInfo.query,
                  payload,
                  path:action.queryInfo.path
              },
              true
          );
  
          console.log("API Response:", response);
      } catch (error) {
          console.error("Unexpected error during API call:", error);
      }finally{
        setIsModalOpen(false);
          console.log("API call completed");
      }
  };
  
    

    return (
      <>
        <h2>{section.sectionName}</h2>
        <div className={styles.parent}>
        {
          // @ts-expect-error as we are not using all the fields
            section.fields?.map((field) => {
              // @ts-expect-error as we are not using all the fields
              const InputComponent = INPUT_MAP[field.type];
              return (
                <div key={field.name}  
                className={styles.child} 
                style={{ gridColumn:"span 20",gap:"10px"}}>
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
          
              {// @ts-expect-error as we are not using all the fields
              section.applicableActions.map((actionKey, index) => {
                const action = section.actionConfig[actionKey as keyof typeof section.actionConfig];
                return (
                  <button
                    key={index}
                    className={styles1.actionButton}
                    onClick={()=>handleOnClick(actionKey)}
                    >
                    { action.label }
                  </button>
                );
              })}
      </div>
        </>
    );
}

