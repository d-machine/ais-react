// UserManagement.tsx
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import clsx from "clsx";
import { useStore } from "../../store2";
import RoleMaster from "../EntryForm/RoleMaster";

interface UserConfig {
  applyAccessLevelRestrictions: boolean;
  onLoad: string;
  onLoadParams: string[];
  queryFile: string;
  pagenation: boolean;
  filterable: boolean;
  sortable: boolean;
  applicableActions: string[];
  actionConfig: {
    [key: string]: ActionConfig;
  };
  columns: Column[];
}

interface ActionConfig {
  label: string;
  onPress: string;
  onPressParams?: string[];
  formConfig?: string;
  query?: string;
  contextParams?: string[];
  onComplete: string;
}

interface Column {
  name: string;
  label: string;
  width: number;
  sortable: boolean;
  filterType: string;
}

interface Roles{
    name: string;
    description: string;
  };
  

interface EntryListProps {
  userConfig: UserConfig;
    setModalContent: (content: React.ReactNode) => void;
    setisopen: (isOpen: boolean) => void;
}

export default function RoleEntryList({setModalContent,setisopen, userConfig }: EntryListProps) {
  const {
    addEntry,
    addRow,
    deleteRow,
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
        const responseConfig=await fetch("http://localhost:5000/list_config");
        const list_config=await responseConfig.json();
        console.log(list_config, "responseConfig");
        
        const response = await fetch(url);
        const fetchedData = await response.json();
        addEntry(userConfig.onLoad);
        fetchedData.forEach((entry: Roles) => {
          const entryData = Object.fromEntries(
            Object.keys(entry).map((key) => [key, entry[key as keyof Roles]])
          );
          addRow(userConfig.onLoad, entryData);
        });
        setRowKeys(useStore.getState().entries[userConfig.onLoad].rowKeys);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const currentState = useStore.getState();
    if (!currentState.entries[userConfig.onLoad]) {
      fetchData();
    } else {
      const existingData: Roles[] = currentState.entries[userConfig.onLoad].rowKeys.map(
        (id) => {
          const row = currentState.entries[userConfig.onLoad].rows[id].updatedData;
          return {
            name: row.name,
            description: row.description,
          } as Roles;
        }
      );
      setRowKeys(currentState.entries[userConfig.onLoad].rowKeys);
      setData(existingData);
      setIsLoading(false);
    }
  }, []);

  const handleRowClick = (rowId: string) => {
    setSelectedRow((prev) => (prev === rowId ? null : rowId));
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleMouseEnter = (
    columnName: string,
    event: React.MouseEvent,
    rowId: string 
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    setHoveredValue(useStore.getState().entries[userConfig.onLoad].rows[rowId].originalData[columnName as keyof Roles] as string);
    setHoveredPosition({
      top: rect.top - 20, 
      left: rect.left + rect.width / 2,
    });
  };

  const handleAddNew = () => {  
    const newUser: Roles = {
        name: "",
        description: "",
      };
    setData([...data, newUser]);
    const rowId=addRow(
      userConfig.onLoad,
      Object.fromEntries(
        Object.keys(newUser).map((key) => [
          key,
          newUser[key as keyof Roles],
        ])
      )
    );
    setSelectedRow(rowId);
    setRowKeys(useStore.getState().entries[userConfig.onLoad].rowKeys);
    setModalContent(<RoleMaster formId={rowId}/>)
    setisopen(true);
  }
  return (
    <div className={styles.entryListContainer}>
      <h2>User Management</h2>
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
            {userConfig.columns.map((column) => (
              <th key={column.name} style={{ width: `${column.width}px` }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowKeys.map((rowId) => {
            const entry =
              useStore.getState().entries[userConfig.onLoad].rows[rowId].updatedData;
            return (
              <tr
                key={rowId}
                className={clsx(`${rowId}`,styles.entryListItem, {
                  [styles.selectedRow]: selectedRow === rowId,
                })}
                onClick={() => handleRowClick(rowId)}
              >
                {userConfig.columns.map((column) => (
                  <td key={column.name} className={styles.entryListCell}
                  onMouseEnter={(e) =>
                    handleMouseEnter(column.name, e, rowId) 
                  }
                  onMouseLeave={() => setHoveredValue(null)}
                  >
                    {entry[column.name as keyof Roles] || ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleAddNew}
        >
          Add New
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              deleteRow(userConfig.onLoad, selectedRow);
              setRowKeys(useStore.getState().entries[userConfig.onLoad].rowKeys);
              setSelectedRow(null);
            }
          }}
        >
          Delete
        </button>
        <button onClick={() => console.log(useStore.getState())}>
          show store
        </button>
      </div>
    </div>
  );
}
