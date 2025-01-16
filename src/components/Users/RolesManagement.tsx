// RoleManagement.tsx
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import clsx from "clsx";
import { useStore } from "../../store1";

interface Section {
  sectionType: "fields" | "table";
  sectionName: string;
  applicableActions: string[];
  actionConfig?: {
    [actionName: string]: {
      label: string;
      onPress: string;
      query?: string;
      payload?: string[];
      contextParams?: string[];
      formConfig?: string;
      onComplete?: string;
    };
  };
  fields?: Field[];
  onLoad?: string; 
  queryFile?: string;
  pagenation?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  columns?: Column[]; 
}


interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean; 
}

interface Column {
  name: string;
  label: string;
  type: string; 
  required: boolean; 
}


interface Roles{
  resource: string;
  access_type: string;
  access_level:string;
};


interface EntryListProps {
  formId:string;
  userConfig: Section;
}

export default function RoleManagement({formId, userConfig }: EntryListProps) {
  const {
    addEntry,
    addRow,
    deleteRow,
    saveRow,
    resetRow,
    resetAllRows,
    addAfter,
  } = useStore();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [data, setData] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowKeys, setRowKeys] = useState<string[]>([]);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ top: number, left: number } | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = `http://localhost:5000/${userConfig.onLoad}`;
        const response = await fetch(url);
        const fetchedData = await response.json();
        addEntry(formId);
        fetchedData.forEach((entry: Roles) => {
          const entryData = Object.fromEntries(
            Object.keys(entry).map((key) => [key, entry[key as keyof Roles]])
          );
          addRow(formId, entryData);
        });
        setRowKeys(useStore.getState().entries[formId].rowKeys);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const currentState = useStore.getState();
    if (!currentState.entries[formId]) {
      fetchData();
    } else {
      const existingData: Roles[] = currentState.entries[formId].rowKeys.map(
        (id) => {
          const row = currentState.entries[formId].rows[id].updatedData;
          return {
            resource: row.resource,
            access_type: row.access_type,
            access_level:row.access_level
          } as Roles;
        }
      );
      setRowKeys(currentState.entries[formId].rowKeys);
      setData(existingData);
      setIsLoading(false);
    }
  }, []);

  const handleRowClick = (rowId: string) => {
    setSelectedRow((prev) => (prev === rowId ? null : rowId));
  };

  const handleInputChange = (
    rowId: string,
    columnName: string,
    value: string | number
  ) => {
    useStore.setState((state) => {
      const updatedRows = {
        ...state.entries[formId].rows,
        [rowId]: {
          ...state.entries[formId].rows[rowId],
          updatedData: {
            ...state.entries[formId].rows[rowId].updatedData,
            [columnName]: value,
          },
        },
      };

      return {
        entries: {
          ...state.entries,
          [formId]: {
            ...state.entries[formId],
            rows: updatedRows,
          },
        },
      };
    });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    if (selectedRow) {
      const tdList=document.querySelectorAll(`tr.${selectedRow} td`);
      tdList.forEach((td)=>{
        td.classList.remove(styles.change);
      })
      saveRow(formId, selectedRow);
      setRowKeys(useStore.getState().entries[formId].rowKeys);
    }
  };


  const handleMouseEnter = (
    columnName: string,
    event: React.MouseEvent,
    rowId: string 
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    setHoveredValue(useStore.getState().entries[formId].rows[rowId].originalData[columnName as keyof Roles] as string);
    setHoveredPosition({
      top: rect.top - 20, // Position the span just above the cell
      left: rect.left + rect.width / 2, // Center it horizontally above the cell
    });
    console.log("Hovered over row:", rowId); // You can access the rowId here
  };
  
  const handleMouseLeave = (rowId: string) => {
    setHoveredValue(null);
    setHoveredPosition(null);
    console.log("Mouse left row:", rowId); // You can access the rowId here
  };
  

  return (
    <div className={styles.entryListContainer}>
      <h2>Role Management</h2>
      {hoveredValue && hoveredPosition && (
        <span
          className={styles.hoveredValue}
          style={{
            top: `${hoveredPosition.top}px`,
            left: `${hoveredPosition.left}px`,
            position: "absolute",
            backgroundColor: "black",
            color: "white",
            padding: "0",
            borderRadius: "3px",
            pointerEvents: "none",
          }}
        >
          {hoveredValue}
        </span>
      )}
      <table className={styles.entryTable}>
        <thead>
          <tr>
            {userConfig.columns?.map((column) => (
              <th key={column.name} style={{ width: `400px` }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowKeys.map((rowId) => {
            const entry =
              useStore.getState().entries[formId].rows[rowId].updatedData;
            return (
              <tr
                key={rowId}
                className={clsx(`${rowId}`,styles.entryListItem, {
                  [styles.selectedRow]: selectedRow === rowId,
                })}
                onClick={() => handleRowClick(rowId)}
              >
                {userConfig.columns?.map((column) => (
                  <td key={column.name} className={styles.entryListCell}
                  onMouseEnter={(e) =>
                    handleMouseEnter(column.name, e, rowId) // Pass rowId here
                  }
                  onMouseLeave={() => handleMouseLeave(rowId)}
                  >
                    <input
                    style={{ width: "100%" }}
                        type="text"
                        value={entry[column.name as keyof Roles] || ""}
                        onChange={(e) => {
                          const inputElement = e.target as HTMLInputElement;
                          // Add the class to the parent element (the <td> element)
                          inputElement.parentElement?.classList.add(styles.change);
                          handleInputChange(rowId, column.name, e.target.value);
                        }}
                        />

                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => {
            const newUser: Roles = {
              resource: "",
              access_type: "",
              access_level: "",
            };
            setData([...data, newUser]);
            addRow(
              formId,
              Object.fromEntries(
                Object.keys(newUser).map((key) => [
                  key,
                  newUser[key as keyof Roles],
                ])
              )
            );
            setRowKeys(useStore.getState().entries[formId].rowKeys);
          }}
        >
          Add New
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              deleteRow(formId, selectedRow);
              setRowKeys(useStore.getState().entries[formId].rowKeys);
              setSelectedRow(null);
            }
          }}
        >
          Delete
        </button>
        <button
          disabled={!selectedRow}
          onClick={handleSave}
        >
          save
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              resetRow(formId, selectedRow);
              const tdList=document.querySelectorAll(`tr.${selectedRow} td`);
              tdList.forEach((td)=>{
                td.classList.remove(styles.change);
              })
              setRowKeys(useStore.getState().entries[formId].rowKeys);
            }
          }}
        >
          ResetRow
        </button>
        <button
          onClick={() => {
            resetAllRows(formId);
            setRowKeys(useStore.getState().entries[formId].rowKeys);
            const tdList=document.querySelectorAll('td');
            tdList.forEach((td)=>{
            td.classList.remove(styles.change);
      })
          }}
        >
          ResetAll
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              const newUser: Roles = {
                resource: "",
                access_type: "",
                access_level: "",
              };
              addAfter(
                formId,
                Object.fromEntries(
                  Object.keys(newUser).map((key) => [
                    key,
                    newUser[key as keyof Roles],
                  ])
                ),
                selectedRow
              );
              setRowKeys(useStore.getState().entries[formId].rowKeys);
            }
          }}
        >
          add After
        </button>
        <button onClick={() => console.log(useStore.getState())}>
          show store
        </button>
      </div>
    </div>
  );
}
