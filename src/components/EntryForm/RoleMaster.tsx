import { useEffect } from "react";
import { EButtonType, EInputType, ESectionType } from "../Input/types";
import { useStore } from "../../store";
import MetaData from "../Input/Index";
import RoleManagement from "../Users/RolesManagement";

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


interface IFieldsSection {
  section: string;
  sectionType: ESectionType.FIELDS;
  fields: Array<IInput>;
}

type TForm = Array<IFieldsSection>;


interface Section {
    sectionType: "fields" | "table";
    sectionName: string;
    applicableActions: string[]; 
    actionConfig?: {
      [actionName: string]: {
        label: string;
        onPress: string;
        query?: string;
        payload?: string[]; 
        contextParams?: string[]; 
        formConfig?: string; 
        onComplete?: string; 
      };
    };
    fields?: Field[]; 
    onLoad?: string;
    queryFile?: string;
    pagenation?: boolean; 
    filterable?: boolean; 
    sortable?: boolean; 
    columns?: Column[];
  }
  
  interface Field {
    name: string;
    label: string;
    type: string;
    required: boolean; 
  }
  
  interface Column {
    name: string;
    label: string;
    type: string; 
    required: boolean; 
  }
  interface Config {
    sections: Section[];
  }
  




export default function RoleMaster({formId}: {formId: string}) {

  useEffect(() => {   
   const currentState = useStore.getState();
   if (!currentState.entries[formId]) {
     currentState.addEntry(formId);
   }
    console.log(useStore.getState().entries, "useStore.getState().entries"); 
    console.log(currentState, "upcurrentState");
  }, [formId]);


  const storeActions = useStore((state) => state);
  const storeData = useStore((state) => state.entries[formId]);

    const metadataConfig = formConfig.find(
      (section) => section.sectionType === ESectionType.FIELDS
    ) as IFieldsSection;

    if (!storeData) {
      return <div>Loading...</div>;
    }

    return (
        <>
            <MetaData
                    id={formId}
                    fields={metadataConfig?.fields || []} 
                    formData={storeData.metadata || {}}
                    selectedValues={storeData.selectedValues}
                    setFormData={storeActions.setFormData}
                    setSelectedValues={storeActions.setSelectedValues}
                  />
            <RoleManagement formId={formId} userConfig={roleConfig.sections[1]}/>
        </>
    );
}

const formConfig: TForm = [
  {
    section: "metadata",
    sectionType: ESectionType.FIELDS,
    fields: [
      {
        name: "name",
        type: EInputType.TEXT,
        label: "Role Name",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "description",
        type: EInputType.TEXT,
        label: "Role Description",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      }
      
    ],
  },
];

const roleConfig:Config={
    "sections": [
      {
        "sectionType": "fields",
        "sectionName": "Role Details",
        "applicableActions": ["save", "cancel"],
        "actionConfig": {
          "save": {
            "label": "Create Role",
            "onPress": "executeQuery",
            "query": "CALL insert_role($1, $2, $3)",
            "payload": ["name", "description"],
            "contextParams": ["current_user_id"],
            "onComplete": "saveResponseAndGoToNextSection"
          },
          "cancel": {
            "label": "Discard Changes",
            "onPress": "exit"
          }
        },
        "fields": [
          {
            "name": "name",
            "label": "Role Name",
            "type": "text",
            "required": true
          },
          {
            "name": "description",
            "label": "Description",
            "type": "text",
            "required": false
          }
        ]
      },
      {
        "sectionType": "table",
        "sectionName": "Claims",
        "onLoad": "roles",
        "queryFile": "list-claims",
        "pagenation": true,
        "filterable": true,
        "sortable": true,
        "applicableActions": ["add", "edit", "delete"],
        "actionConfig": {
          "add": {
            "label": "Add New Claim",
            "onPress": "displayForm",
            "formConfig": "add-claim",
            "onComplete": "refresh"
          },
          "edit": {
            "label": "Edit Claim",
            "onPress": "dispayForm",
            "payload": ["claim_id"],
            "formConfig": "edit-claim",
            "onComplete": "refresh"
          },
          "delete": {
            "label": "Delete Claim",
            "onPress": "executeQuery",
            "query": "CALL delete_claim($1, $2)",
            "payload": ["claim_id"],
            "onComplete": "refresh"
          }
        },
        "columns": [
          {
            "name": "resource",
            "label": "Resource",
            "type": "text",
            "required": true
          },
          {
            "name": "access_type",
            "label": "Access Type",
            "type": "text",
            "required": true
          },
          {
            "name": "access_level",
            "label": "Access Level",
            "type": "text",
            "required": true
          }
        ]
      }
    ]
  }