import Modal from "./SelectModal";
import styles from "./SelectModal.module.css"
import _ from "lodash";
import { useState } from "react";
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

interface InputSelectProps {
    field:Field;
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setSelectedValues: (name: string, value: { id: string | number; name: string }) => void;
    setFormData: (name: string, value: string | number) => void
}

export default function InputSelect({field,selectedValues,setSelectedValues,setFormData}:InputSelectProps) {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalName, setModalName] = useState('');
    const [modalData, setModalData] = useState<Array<{ id: number ; name: string }>>([]);

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
    setSelectedValues(name, value); 
    setFormData(name, value.name); 
  };

    return(
        <>
        <label>{field.label}</label>
        <input
            value={selectedValues[field.name]?.name || ""}
            className={styles.input}
            style={{ width: field.input_width }}
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
          onSelect={ (name: string, value: { id: string | number; name: string })=>handleSelect(name, value)}
        />
        }
        </>
    );
}