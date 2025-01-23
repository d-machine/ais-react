import { useEffect, useState } from "react";
import { useStore } from "../../store1";
import RoleManagement from "../Users/RolesManagement";
import Form from "../Input/newIndex";
import { EFieldType } from "../Input/types";
// import styles1 from "../Input/SelectModal.module.css";

interface Section {
  sectionType: string;
  sectionName: string;
  queryReturnType: string;
  query: string;
  payload: string[];
  applicableActions: string[];
  actionConfig: ActionConfig;
  fields: Field[];
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

interface Root {
  sections: Section[];
}

interface Props {
  addConfig: Root;
  formId: string;
}

export default function RoleMaster({ addConfig, formId }: Props) {
  const { addEntry, setFormData, setSelectedValues } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log(addConfig);
    
    const currentState = useStore.getState();
    if (!currentState.entries[formId]) {
      addEntry(formId);
    }
    setIsLoading(false);
  }, [formId]);

  if (isLoading) return <div>Loading...</div>;

  
  return (
    <>
      <Form
        selectedValues={useStore.getState().entries[formId]?.selectedValues || {}}
        setSelectedValues={setSelectedValues}
        setFormData={setFormData}
        formData={useStore.getState().entries[formId]?.metadata || {}}
        formId={formId}
        section={addConfig[0]}
      />
      {addConfig.length > 1 ? (
        <RoleManagement formId={formId} userConfig={addConfig[1]} />
      ) : null}
    </>
  );
  
}

