import { useState } from "react";
import styles from "./SelectModal.module.css"
import Modal from "./SelectModal";
import { postApiCall } from "../../api/base";


// interface Field {
//   name: string;
//   label: string;
//   type: string;
//   required?: boolean;
//   query?: string;
//   disabled?: boolean;
//   }
  

interface InputSelectProps {
    id:string,
    field:any;
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (id : string,name: string, value: { id: string | number; name: string }) => void;
    setFormData: (id:string,name: string, value: string | number) => void;
    formData: { [key: string]: string | number };
    
}

export default function InputSelect({id,field,formData,setSelectedValues,setFormData}:InputSelectProps) {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalName, setModalName] = useState('');
    const [modalData, setModalData] = useState<Array<{ id: number ; name: string }>>([]);
    const [modalFields, setModalFields] = useState<Array<{ key: string; as: string }>>([]);

    const handleInputDoubleClick = async () => {
      setModalTitle(field.label);
      setModalName(field.name);
  
      const data = await fetchData();
      console.log(data);
      
      setModalData(data);
      setModalFields(field.selectConfig.fields_to_extract || []); 
      setModalOpen(true);
    };
  
    const fetchData = async () => {
      try {
        const response = await postApiCall("/api/generic/executeQuery", { configFile: field.selectConfig.resource }, true);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };

    const handleSelect = (name: string, value: any) => {
      console.log(value);
      console.log(modalFields);
      
      
      setSelectedValues(id, name, value);
      setFormData(id, name, value[modalFields[0]?.key] || ""); // Use extracted name field
    };

  // const handleSelect = (name: string, value: { id: string | number; name: string }) => {
  //   setSelectedValues(id,name, value); 
  //   setFormData(id,name, value.name); 
  // };

    return(
        <>
        <label>{field.label}</label>
        <input
          value={formData[field.name] || ""}
            className={styles.input}
            style={{ width:"200" }}
            type="text"
            readOnly
            placeholder="Double Click"
            onDoubleClick={() => handleInputDoubleClick(field)}
        />
          {
          modalOpen &&
          <Modal
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          data={modalData}
          fieldname={modalName}
          onSelect={handleSelect}
          fields={modalFields}
          isMulti={field.multi || false} // Handle multi-select cases
        />
        }
        </>
    );
}