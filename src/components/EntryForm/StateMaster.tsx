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
export default function StateMaster({formId}: {formId: string}) {

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
        name: "statecode",
        type: EInputType.TEXT,
        label: "State Code",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name:"statename",
        type:EInputType.TEXT,
        label:"State Name",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
      },{
        name: "countrycode",
        type: EInputType.SELECT,
        label: "Country Code",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
        selectQuery: "select id, code from country",
      },{
        name: "Submit",
        type: EInputType.BUTTON,
        label: "Submit",
        required: false,
        readOnly: false,
        grid_column: "span 5",
        width: 200,
        input_width: 50,
        buttonType: EButtonType.ADD, 
        value: "Submit",
        dependencies: [],
      }],
  },
];