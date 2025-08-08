import { useEffect, useState } from "react";
import { useAddStore } from "@components/EntryList/useAddStore";
import Management from "@components/EntryList/Management";
import Form from "../Input/Index";

interface Props {
  addConfig: any[];
  formId: string;
  setIsModalOpen: (value: boolean) => void;
  configFile: string;
}

export default function Master({configFile, addConfig, formId ,setIsModalOpen}: Props) {
  const { addEntry, setFormData, setSelectedValues } = useAddStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {

    
    const currentState = useAddStore.getState();
    if (!currentState.entries[formId]) {
      addEntry(formId);
    }
    setIsLoading(false);
  }, [formId]);

  if (isLoading) return <div>Loading...</div>;

  
  return (
    <div style={{ 
      width: "90%",
      height: "100%", 
      display: "flex",
      flexDirection: "column",
      gap: "5px" 
    }}>
      <div style={{
        flex: "1 1 40%", 
        minHeight: 0, 
        overflowY: "auto" 
      }}>
      <Form
      configFile={configFile}
        setIsModalOpen={setIsModalOpen}
        selectedValues={useAddStore.getState().entries[formId]?.selectedValues || {}}
        setSelectedValues={setSelectedValues}
        setFormData={setFormData}
        formData={useAddStore.getState().entries[formId]?.metadata || {}}
        formId={formId}
        section={addConfig[0]}
        />
        </div>

      {addConfig.length > 1 ? (
        <div style={{
          flex: "1 1 60%", 
          minHeight: 0, 
        }}>
        <Management configFile={configFile} formId={formId} userConfig={addConfig[1]} />
      </div>
      ) : null}
    </div>
  );
  
}

