import Table from '../Table/Table';
import _ from "lodash";
import { useFormStore, useGridStore } from '../../store';
import { EInputType } from '../Input/types';
import Form from '../Input/Index';


interface DependencyField {
  as: string;
  key: string;
}

interface Dependency {
  dependency: string;
  fields: DependencyField[];
}
interface Field {
  name:string;
  type:EInputType;
  label:string;
  grid_column:string;
  dependencies:Dependency[];
  select_query: string;
  to_show: string;
  width:number;
  input_width:number;
}

interface FormCongif{
  section:string;
  fields:Field[];
}

const formConfig: FormCongif =
{
  "section": "metadata",
  "fields": [{
      "name": "entryNo",
      "type": EInputType.TEXT,//can be select
      "label": "Ent No",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100
  }, {
      "name": "entryDate",
      "type": EInputType.DATE,
      "label": "Ent Date",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100
  },{
      "name": "challanNo",
      "type": EInputType.TEXT,
      "label": "Challan No",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100
  },{
      "name": "challanDate",
      "type": EInputType.DATE,
      "label": "Challan Date",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100 
  }
  ,{
    "name":"log",
    "type":EInputType.BUTTON,
    "label":"Log",
    "grid_column": "span 5",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",
    "input_width":50
  }
  
  ,{
      "name": "Process",
      "type": EInputType.TEXT,
      "label": "Process",
      "grid_column": "span 20",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 300
  },{
    "name":"LotNo",
    "type":EInputType.TEXT,    
    "label":"Lot No",
    "grid_column": "span 10",
    "width":200, 
    "dependencies":[],
    "select_query":"",
    to_show:"",   
    "input_width":100
  },{
    "name":"Party",
    "type":EInputType.SELECT,
    "label":"Party",
    "grid_column": "span 20",
    "width":200,
    "dependencies":[],
    "select_query":"SELECT id,name FROM Party",
    to_show:"name",
    "input_width":300
  },{
    "name":"Godown",
    "type":EInputType.SELECT,    
    "label":"Godown",
    "grid_column": "span 20",
    "dependencies":[{"dependency":"Party",fields:[{ as:"party_id",key:"id" }]}], 
    "select_query":"SELECT id,name FROM Godown WHERE party_id={party_id}",
    //"select_config+data" 
    "to_show":"name",
    "width":200,    
    "input_width":300
  },{
    "name":"Transport",
    "type":EInputType.TEXT,
    "label":"Transport",
    "grid_column": "span 20",
    "width":200,    
    "dependencies":[],
    "select_query":"",
    to_show:"", 
    "input_width":300
  },{
    "name":"Lrno.",
    "type":EInputType.TEXT,    
    "label":"Lrno.",
    "grid_column": "span 10",
    "width":200, 
    "dependencies":[],
    "select_query":"",
    to_show:"",    
    "input_width":100
  },{
    "name":"Lrdt.",
    "type":EInputType.DATE,    
    "label":"Lrdt.",
    "grid_column": "span 10",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",     
    "input_width":100
  },{
    "name":"Something",
    "type":EInputType.TEXT,    
    "label":"Something",
    "grid_column": "span 10",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",     
    "input_width":100
  },{
    "name":"Shade",
    "type":EInputType.TEXT,    
    "label":"Shade",
    "grid_column": "span 10",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",     
    "input_width":100
  },{
    "name":"Color",
    "type":EInputType.TEXT,    
    "label":"Color",
    "grid_column": "span 10",
    "width":200, 
    "dependencies":[],
    "select_query":"",
    to_show:"",    
    "input_width":100
  },{
    "name":"Submit",
    "type":EInputType.BUTTON,
    "label":"Submit",
    "grid_column": "span 5",
    "width":200,  
    "dependencies":[],
    "select_query":"",
    to_show:"",    
    "input_width":50
  }]
}


interface TableField {
  name: string;
  type: string;
  label: string;
  minColumnWidth: string;
  width: string;
}
interface TableConfig {
  section: string;
  fields: TableField[];
}

const TABLE_CONFIG: TableConfig = {
  section: "table-grid",
  fields: [
    { name: "quality", type: "text", label: "Quality", minColumnWidth: "100px", width: "200px" },
    { name: "Recqty", type: "number", label: "Rec Qty", minColumnWidth: "100px", width: "150px" },
    { name: "Sno", type: "number", label: "S No", minColumnWidth: "100px", width: "100px" },
    { name: "shade", type: "text", label: "Shade", minColumnWidth: "100px", width: "150px" },
    { name: "color", type: "text", label: "Color", minColumnWidth: "100px", width: "150px" },
    { name: "Dygqty", type: "number", label: "Dyg Qty", minColumnWidth: "100px", width: "150px" },
    { name: "Balqty", type: "number", label: "Bal Qty", minColumnWidth: "100px", width: "150px" },
    { name: "y_n", type: "text", label: "Y/N", minColumnWidth: "100px", width: "100px" },
    { name: "shrinkage", type: "number", label: "Shrinkage", minColumnWidth: "100px", width: "150px" },
    { name: "percentage", type: "number", label: "Percentage", minColumnWidth: "100px", width: "150px" },
    { name: "pcs", type: "number", label: "Pcs", minColumnWidth: "100px", width: "150px" },
    { name: "issueqty", type: "number", label: "Issue Qty", minColumnWidth: "100px", width: "150px" },
    { name: "Lotno", type: "number", label: "Lot No", minColumnWidth: "100px", width: "150px" },
    { name: "barcodeno", type: "number", label: "Barcode No", minColumnWidth: "100px", width: "150px" },
    { name: "Rack", type: "text", label: "Rack", minColumnWidth: "100px", width: "150px" }
  ]
};

export default function EntryForm() {

  const {
    formData,
    selectedValues,
    setFormData,
    setSelectedValues,
  } = useFormStore();


    const {rows,setRows} = useGridStore();

  return (
    <>
    <Form
        fields={formConfig.fields}
        formData={formData}
        selectedValues={selectedValues}
        setFormData={setFormData}
        setSelectedValues={setSelectedValues}
    />
    <Table 
    fields={TABLE_CONFIG.fields}
    rows={rows}
    setRows={setRows}
    />
    </>
  );
} 



