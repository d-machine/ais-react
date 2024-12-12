import styles from './EntryForm.module.css';
import Table from '../Table/Table';

interface FormCongif{
  section:string;
  fields:{
    name:string;
    type:string;
    label:string;
    grid_column:string;
    width:number;
    input_width:number;
  }[];
}

const formConfig: FormCongif =
{
  "section": "metadata",
  "fields": [{
      "name": "entryNo",
      "type": "text",
      "label": "Ent No",
      "grid_column": "span 10",
      "width": 200,
      "input_width": 100
  }, {
      "name": "entryDate",
      "type": "date",
      "label": "Ent Date",
      "grid_column": "span 10",
      "width": 200,
      "input_width": 100
  },{
      "name": "challanNo",
      "type": "text",
      "label": "Challan No",
      "grid_column": "span 10",
      "width": 200,
      "input_width": 100
  },{
      "name": "challanDate",
      "type": "date",
      "label": "Challan Date",
      "grid_column": "span 10",
      "width": 200,
      "input_width": 100 //after this a button
  },{
    "name":"log",
    "type":"button",
    "label":"Log",
    "grid_column": "span 5",
    "width":200,
    "input_width":50
  },{
      "name": "Process",
      "type": "text",
      "label": "Process",
      "grid_column": "span 20",
      "width": 200,
      "input_width": 300
  },{
    "name":"LotNo",
    "type":"text",    
    "label":"Lot No",
    "grid_column": "span 10",
    "width":200,    
    "input_width":100
  },{
    "name":"Party",
    "type":"text",
    "label":"Party",
    "grid_column": "span 20",
    "width":200,
    "input_width":300
  },{
    "name":"Godown",
    "type":"text",    
    "label":"Godown",
    "grid_column": "span 20",
    "width":200,    
    "input_width":300
  },{
    "name":"Transport",
    "type":"text",
    "label":"Transport",
    "grid_column": "span 20",
    "width":200,    
    "input_width":300
  },{
    "name":"Lrno.",
    "type":"text",    
    "label":"Lrno.",
    "grid_column": "span 10",
    "width":200,    
    "input_width":100
  },{
    "name":"Lrdt.",
    "type":"date",    
    "label":"Lrdt.",
    "grid_column": "span 10",
    "width":200,    
    "input_width":100
  },{
    "name":"Something",
    "type":"text",    
    "label":"Something",
    "grid_column": "span 10",
    "width":200,    
    "input_width":100
  },{
    "name":"Shade",
    "type":"text",    
    "label":"Shade",
    "grid_column": "span 10",
    "width":200,    
    "input_width":100
  },{
    "name":"Color",
    "type":"text",    
    "label":"Color",
    "grid_column": "span 10",
    "width":200,    
    "input_width":100
  }]
}

export default function EntryForm() {
  return (
    <>
    <div className={styles.parent}>
    {formConfig.fields.map((field) => (
  <div key={field.name} className={styles.child} style={{ gridColumn: field.grid_column }}>
    {field.type === "button" ? (
      <button className={styles.input} style={{ width: field.input_width,textAlign:"center" }}>
        {field.label}
      </button>
    ) : (
      <>
        <label>{field.label}</label>
        <input className={styles.input} style={{ width: field.input_width }} type={field.type} />
      </>
    )}
  </div>
))}



      {/* <div className={styles.child + ' ' + styles.child1}>
        <label>Ent No</label>
        <input className={styles.input + ' ' + styles.input1} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child2}>
        <label>Ent Date</label>
        <input className={styles.input + ' ' + styles.input2} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child3}>
        <label>Challan No</label>
        <input className={styles.input + ' ' + styles.input3} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child4}>
        <label>Challan Dt</label>
        <input className={styles.input + ' ' + styles.input4} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child5}>
        <button className={styles.input + ' ' + styles.input5}>Log</button>
      </div>
      <div className={styles.child + ' ' + styles.child6}>
        <label>Process</label>
        <input className={styles.input + ' ' + styles.input6} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child7}>
        <label>Lot No</label>
        <input className={styles.input + ' ' + styles.input7} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child8}>
        <label>Party</label>
        <input className={styles.input + ' ' + styles.input8} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child9}>
        <label>Godown</label>
        <input className={styles.input + ' ' + styles.input9} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child10}>
        <label>Transport</label>
        <input className={styles.input + ' ' + styles.input10} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child11}>
        <label>Lrno.</label>
        <input className={styles.input + ' ' + styles.input11} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child12}>
        <label>Lrdt.</label>
        <input className={styles.input + ' ' + styles.input12} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child13}>
        <label>Something</label>
        <input className={styles.input + ' ' + styles.input13} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child14}>
        <label>Shade</label>
        <input className={styles.input + ' ' + styles.input14} type="text" />
      </div>
      <div className={styles.child + ' ' + styles.child15}>
        <label>Color</label>
        <input className={styles.input + ' ' + styles.input15} type="text" />
      </div> */}
    </div>
      <Table/>
    </>
  );
} 