import { useEffect } from "react";
import { EButtonType, EInputType, ESectionType } from "../Input/types";
import { useStore } from "../../store";
import MetaData from "../Input/Index";

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
export default function UserMaster({formId}: {formId: string}) {

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
        </>
    );
}

const formConfig: TForm = [
  {
    section: "metadata",
    sectionType: ESectionType.FIELDS,
    fields: [
      {
        name: "username",
        type: EInputType.TEXT,
        label: "Username",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name:"email",
        type:EInputType.TEXT,
        label:"Email",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
      },{
        name:"full_name",
        type:EInputType.TEXT,
        label:"Full Name",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
      },{
        name: "reports_to",
        type: EInputType.TEXT,
        label: "Reports To",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },{
        name: "roles",
        type: EInputType.TEXT,
        label: "Roles",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },{
        name: "last_updated_by",
        type: EInputType.TEXT,
        label: "Last Updated By",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },{
        name: "last_updated_at",
        type: EInputType.TEXT,
        label: "Last Updated At",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      }],
  },
];