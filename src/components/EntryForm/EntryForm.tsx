import Table from '../Table/Table';
import _ from "lodash";
import { useStore } from '../../store';
import { EGridTye, EInputType,EButtonType, ESectionType } from '../Input/types';
import MetaData from '../Input/Index';
import { useEffect} from 'react';

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

interface Icolumn{
  name: string;
  type:EGridTye;
  label: string;    
  required: boolean;
  readOnly: boolean;
  columnWidth: number;
}


interface Caption {
  name: string;
  label: string;
  fields:{
    name: string;
    type:EInputType.BUTTON,
    label: string;
  }[];
}

interface ITableSection {
  section: string;
  sectionType: ESectionType.TABLE;
  caption?: Caption;
  columns: Array<Icolumn>;
}

type TForm = Array<IFieldsSection | ITableSection>;



export default function EntryForm({formId}: {formId: string}) {


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
 
  const tableConfig = formConfig.find(
    (section) => section.sectionType === ESectionType.TABLE
  ) as ITableSection;

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
      <Table
        id={formId}
        fields={tableConfig?.columns || []} 
        rows={storeData.rows}
        setRows={storeActions.setRows}
      />
      {formId}
      <button onClick={() => console.log(useStore.getState().entries, "useStore.getState().entries")}>Show store</button>
    </>
  );
}


const formConfig: TForm = [
  {
    section: "metadata",
    sectionType: ESectionType.FIELDS,
    fields: [
      {
        name: "entryNo",
        type: EInputType.TEXT,
        label: "Ent No",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "entryDate",
        type: EInputType.DATE,
        label: "Ent Date",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "challanNo",
        type: EInputType.TEXT,
        label: "Challan No",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "challanDate",
        type: EInputType.DATE,
        label: "Challan Date",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "log",
        type: EInputType.BUTTON,
        label: "Log",
        required: false,
        readOnly: false,
        grid_column: "span 5",
        width: 200,
        input_width: 50,
        buttonType: EButtonType.CANCEL, 
        value: "Log", 
        dependencies: [],
      }
      ,
      {
        name: "Process",
        type: EInputType.TEXT,
        label: "Process",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
      },
      {
        name: "LotNo",
        type: EInputType.TEXT,
        label: "Lot No",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "Party",
        type: EInputType.SELECT,
        label: "Party",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
        selectQuery: "SELECT id,name FROM Party",
      },
      {
        name: "Godown",
        type: EInputType.SELECT,
        label: "Godown",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [
          {
            dependency: "Party",
            fields: [{ as: "party_id", key: "id" }],
          },
        ],
        selectQuery: "SELECT id,name FROM Godown WHERE party_id={party_id}",
      },
      {
        name: "Transport",
        type: EInputType.TEXT,
        label: "Transport",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
      },
      {
        name: "Lrno.",
        type: EInputType.TEXT,
        label: "Lrno.",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "Lrdt.",
        type: EInputType.DATE,
        label: "Lrdt.",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "Something",
        type: EInputType.TEXT,
        label: "Something",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "Shade",
        type: EInputType.TEXT,
        label: "Shade",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name: "Color",
        type: EInputType.TEXT,
        label: "Color",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
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
        }  ,      
    ],
  },
  {
    section: "table-grid",
    sectionType: ESectionType.TABLE,
    caption: {
      name: 'tableFormat',
      label: 'Table Format',
      fields: [
          {
              name: 'addNew',
              type: EInputType.BUTTON,
              label: 'Add New'
          }
      ]
  },
    columns: [
      { name: "quality", type: EGridTye.TEXT, label: "Quality", required: false, readOnly: false, columnWidth: 200 },
      { name: "Recqty", type: EGridTye.NUMBER, label: "Rec Qty", required: false, readOnly: false, columnWidth: 150 },
      { name: "Sno", type: EGridTye.NUMBER, label: "S No", required: false, readOnly: false, columnWidth: 100 },
      { name: "shade", type: EGridTye.TEXT, label: "Shade", required: false, readOnly: false, columnWidth: 150 },
      { name: "color", type: EGridTye.TEXT, label: "Color", required: false, readOnly: false, columnWidth: 150 },
      { name: "Dygqty", type: EGridTye.NUMBER, label: "Dyg Qty", required: false, readOnly: false, columnWidth: 150 },
      { name: "Balqty", type: EGridTye.NUMBER, label: "Bal Qty", required: false, readOnly: false, columnWidth: 150 },
      { name: "y_n", type: EGridTye.TEXT, label: "Y/N", required: false, readOnly: false, columnWidth: 100 },
      { name: "shrinkage", type: EGridTye.NUMBER, label: "Shrinkage", required: false, readOnly: false, columnWidth: 150 },
      { name: "percentage", type: EGridTye.NUMBER, label: "Percentage", required: false, readOnly: false, columnWidth: 150 },
      { name: "pcs", type: EGridTye.NUMBER, label: "Pcs", required: false, readOnly: false, columnWidth: 150 },
      { name: "issueqty", type: EGridTye.NUMBER, label: "Issue Qty", required: false, readOnly: false, columnWidth: 150 },
      { name: "Lotno", type: EGridTye.NUMBER, label: "Lot No", required: false, readOnly: false, columnWidth: 150 },
      { name: "barcodeno", type: EGridTye.NUMBER, label: "Barcode No", required: false, readOnly: false, columnWidth: 150 },
      { name: "Rack", type: EGridTye.TEXT, label: "Rack", required: false, readOnly: false, columnWidth: 150 },
    ],
  },
];


