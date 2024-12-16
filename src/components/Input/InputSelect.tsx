
import styles from "../EntryForm/EntryForm.module.css"
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

interface InputSelectProps {
    field:Field;
    selectedValues: { [key: string]: { id: string | number; name: string } };
    setModalTitle: (title: string) => void;
    setModalName: (name: string) => void;
    setModalData: (data: Array<{ id: number; name: string }>) => void;
    setModalOpen: (open: boolean) => void;
}

export default function InputSelect({field,selectedValues,setModalTitle,setModalName,setModalData,setModalOpen}:InputSelectProps) {
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
        </>
    );
}