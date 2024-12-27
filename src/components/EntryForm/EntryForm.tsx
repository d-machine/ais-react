import Table from '../Table/Table';
// import _ from "lodash";
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
    </>
  );
}


const formConfig: TForm = [
  {
    section: "metadata",
    sectionType: ESectionType.FIELDS,
    fields: [
      {
        name:"partycode",
        type: EInputType.TEXT,
        label: "Party Code",
        required: false,
        readOnly: false,
        grid_column: "span 10",
        width: 200,
        input_width: 100,
        dependencies: [],
      },
      {
        name:"partyname",
        type:EInputType.TEXT,
        label:"Party Name",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
      },
      {
        name:"category",
        type:EInputType.SELECT,
        label:"Category",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
        selectQuery:"SELECT id,name FROM Category",
      },{
        name:"partytype",
        type:EInputType.SELECT,
        label:"Party Type",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
        selectQuery:"SELECT id,name FROM PartyType",
      },
      {
        name:"accountname",
        type:EInputType.SELECT,
        label:"A/c Name",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
        selectQuery:"SELECT id,name FROM Account",
      },{
        name:"contactperson",
        type:EInputType.TEXT,
        label:"Contact Person",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
      },{
        name:"city",
        type:EInputType.SELECT,
        label:"City",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
        selectQuery:"SELECT id,name FROM City",
      },{
        name:"state",
        type:EInputType.SELECT,
        label:"State",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
        selectQuery:"SELECT id,name FROM State",
      },{
        name:"district",
        type:EInputType.SELECT,
        label:"District",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"pincode",
        type:EInputType.TEXT,
        label:"Pincode",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"phonenumber",
        type:EInputType.TEXT,
        label:"Phone No.",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
      },{
        name:"mobilenumber",
        type:EInputType.TEXT,
        label:"Mobile No.",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
      },{
        name:"email",
        type:EInputType.TEXT,
        label:"Email",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
      },{
        name:"gstin",
        type:EInputType.TEXT,
        label:"GSTIN",
        required:false,
        readOnly:false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies:[],
      },{
        name:"pan",
        type:EInputType.TEXT,
        label:"PAN",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"cin",
        type:EInputType.TEXT,
        label:"CIN",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"mfmsid",
        type:EInputType.TEXT,
        label:"MFMS ID",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"dlno",
        type:EInputType.TEXT,
        label:"DL No",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"partygroup",
        type:EInputType.SELECT,
        label:"Party Group",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
        selectQuery:"SELECT id,name FROM PartyGroup",
      },{
        name:"creditlimit",
        type:EInputType.TEXT,
        label:"Credit Limit",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"creditperiod",
        type:EInputType.TEXT,
        label:"Credit Period",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"creditinvoice",
        type:EInputType.TEXT,
        label:"Credit Invoice",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
      },{
        name:"status",
        type:EInputType.SELECT,
        label:"Status",
        required:false,
        readOnly:false,
        grid_column:"span 10",
        width:200,
        input_width:100,
        dependencies:[],
        selectQuery:"SELECT id,name FROM Status",
      },
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
        name:"address",
        type: EInputType.TEXTFIELD,
        label: "Address",
        required: false,
        readOnly: false,
        grid_column: "span 20",
        width: 200,
        input_width: 300,
        dependencies: [],
      }
      ,
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


