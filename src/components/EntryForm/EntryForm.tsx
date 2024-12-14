import styles from './EntryForm.module.css';
import Table from '../Table/Table';
import {useState} from 'react';
import Modal from './SelectModal';
import _ from "lodash";

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
  type:string;
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
      "type": "text",//can be select
      "label": "Ent No",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100
  }, {
      "name": "entryDate",
      "type": "date",
      "label": "Ent Date",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100
  },{
      "name": "challanNo",
      "type": "text",
      "label": "Challan No",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100
  },{
      "name": "challanDate",
      "type": "date",
      "label": "Challan Date",
      "grid_column": "span 10",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 100 
  },{
    "name":"log",
    "type":"button",
    "label":"Log",
    "grid_column": "span 5",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",
    "input_width":50
  },{
      "name": "Process",
      "type": "text",
      "label": "Process",
      "grid_column": "span 20",
      "width": 200,
      "dependencies":[],
      "select_query":"",
      to_show:"",
      "input_width": 300
  },{
    "name":"LotNo",
    "type":"text",    
    "label":"Lot No",
    "grid_column": "span 10",
    "width":200, 
    "dependencies":[],
    "select_query":"",
    to_show:"",   
    "input_width":100
  },{
    "name":"Party",
    "type":"select",
    "label":"Party",
    "grid_column": "span 20",
    "width":200,
    "dependencies":[],
    "select_query":"SELECT id,name FROM Party",
    to_show:"name",
    "input_width":300
  },{
    "name":"Godown",
    "type":"select",    
    "label":"Godown",
    "grid_column": "span 20",
    "dependencies":[{"dependency":"Party",fields:[{ as:"party_id",key:"id" }]}], 
    "select_query":"SELECT id,name FROM Godown WHERE party_id={party_id}",
    "to_show":"name",
    "width":200,    
    "input_width":300
  },{
    "name":"Transport",
    "type":"text",
    "label":"Transport",
    "grid_column": "span 20",
    "width":200,    
    "dependencies":[],
    "select_query":"",
    to_show:"", 
    "input_width":300
  },{
    "name":"Lrno.",
    "type":"text",    
    "label":"Lrno.",
    "grid_column": "span 10",
    "width":200, 
    "dependencies":[],
    "select_query":"",
    to_show:"",    
    "input_width":100
  },{
    "name":"Lrdt.",
    "type":"date",    
    "label":"Lrdt.",
    "grid_column": "span 10",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",     
    "input_width":100
  },{
    "name":"Something",
    "type":"text",    
    "label":"Something",
    "grid_column": "span 10",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",     
    "input_width":100
  },{
    "name":"Shade",
    "type":"text",    
    "label":"Shade",
    "grid_column": "span 10",
    "width":200,
    "dependencies":[],
    "select_query":"",
    to_show:"",     
    "input_width":100
  },{
    "name":"Color",
    "type":"text",    
    "label":"Color",
    "grid_column": "span 10",
    "width":200, 
    "dependencies":[],
    "select_query":"",
    to_show:"",    
    "input_width":100
  }]
}

export default function EntryForm() {

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalData, setModalData] = useState<Array<{ id: number ; name: string }>>([]);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: { id: string | number; name: string };
  }>({});

  const handleInputDoubleClick = async (field: Field) => {
    if (field.dependencies.length > 0) {
      const allDependenciesValid = validateDependencies(field.dependencies);
      if (!allDependenciesValid) return;
    }
  
    setModalTitle(field.label);
    setModalName(field.name);
  
    const dependencyData = parseDependencies(field.dependencies, selectedValues);
    console.log(dependencyData, "dependencyData");
  
    const data = await fetchData(field.name, field.select_query, dependencyData);
  
    setModalData(data);
    setModalOpen(true);
  };
  
  const validateDependencies = (dependencies: Dependency[]) => {
    for (const dependency of dependencies) {
      const dependencyValue = selectedValues[dependency.dependency];
      if (!dependencyValue) {
        alert(`Please select a value for ${dependency.dependency}`);
        return false;
      }
    }
    return true;
  };
  
  const fetchData = async (
    name: string,
    select_query: string,
    dependencyData: { [key: string]: string | number }
  ) => {
    const response = await fetch(
      `http://localhost:5000/get_data?table=${name}&select_query=${select_query}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dependencyData),
      }
    );
    const data = await response.json();
    return data;
  };
  
  function parseDependencies(
    dependencies: Dependency[],
    data: { [key: string]: { id: string | number; name: string } }
  ) {
    const _dependenciesData: { [key: string]: string | number } = {};
    _.forEach(dependencies, ({ dependency, fields }) => {
      const dependencyData = data?.[dependency];
      _.forEach(fields, (field) => {
        _dependenciesData[field.as] = _.get(dependencyData, field.key);
      });
    });
    return _dependenciesData;
  }
  
  const handleSelect = (name: string, value: { id: string | number; name: string }) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value, 
    }));
  };
  


  return (
    <>
    <div className={styles.parent}>
    {formConfig.fields.map((field) => (
  <div key={field.name} className={styles.child} style={{ gridColumn: field.grid_column }}>
    {field.type === "button" ? (
      <button className={styles.input} style={{ width: field.input_width,textAlign:"center" }}>
        {field.label}
      </button>
    ) : field.type=="select" ? (
      <>
      <label>{field.label}</label>
      <input
        value={selectedValues[field.name] ? selectedValues[field.name].name : ''}
        className={styles.input}
        style={{ width: field.input_width }}
        type="text"
        readOnly
        placeholder='Double Click'
        onDoubleClick={() => handleInputDoubleClick(field)}
      />
    </>
        ) : (
      <>
        <label>{field.label}</label>
        <input className={styles.input} style={{ width: field.input_width }} type={field.type} />
      </>
    )}  
  </div>
))}

{
      modalOpen &&
      <Modal
      onClose={() => setModalOpen(false)}
      title={modalTitle}
      data={modalData}
      fieldname={modalName}
      onSelect={ (name: string, value: { id: string | number; name: string })=>handleSelect(name, value)}
    />
    }

    </div>
      <Table/>
    </>
  );
} 