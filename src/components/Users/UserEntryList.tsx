// UserManagement.tsx
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import clsx from "clsx";
import { useStore } from "../../store2";
import UserMaster from "../EntryForm/UserMaster";

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

interface User {
  username: string;
  email: string;
  full_name: string;
  reports_to: string;
  roles: string;
  last_updated_by: string;
  last_updated_at: string;
}


interface EntryListProps {
  userConfig: UserConfig;
    setModalContent: (content: React.ReactNode) => void;
    setisopen: (isOpen: boolean) => void;
}

export default function UserEntryList({setModalContent,setisopen, userConfig }: EntryListProps) {
  const {
    addEntry,
    addRow,
    deleteRow,
  } = useStore();

  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [data, setData] = useState<User[]>([]);
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
        addEntry(userConfig.onLoad);
        fetchedData.forEach((entry: User) => {
          const entryData = Object.fromEntries(
            Object.keys(entry).map((key) => [key, entry[key as keyof User]])
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
      const existingData: User[] = currentState.entries[userConfig.onLoad].rowKeys.map(
        (id) => {
          const row = currentState.entries[userConfig.onLoad].rows[id].updatedData;
          return {
            username: row.username,
            email: row.email,
            full_name: row.full_name,
            reports_to: row.reports_to,
            roles: row.roles,
            last_updated_by: row.last_updated_by,
            last_updated_at: row.last_updated_at,
          } as User;
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

    setHoveredValue(useStore.getState().entries[userConfig.onLoad].rows[rowId].originalData[columnName as keyof User] as string);
    setHoveredPosition({
      top: rect.top - 20, 
      left: rect.left + rect.width / 2,
    });
  };

  const handleAddNew = () => {  
    const newUser: User = {
      username: "",
      email: "",
      full_name: "",
      reports_to: "",
      roles: "",
      last_updated_by: "",
      last_updated_at: new Date().toISOString(),
    };
    setData([...data, newUser]);
    const rowId=addRow(
      userConfig.onLoad,
      Object.fromEntries(
        Object.keys(newUser).map((key) => [
          key,
          newUser[key as keyof User],
        ])
      )
    );
    setSelectedRow(rowId);
    setRowKeys(useStore.getState().entries[userConfig.onLoad].rowKeys);
    setModalContent(<UserMaster formId={rowId}/>)
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
                    {entry[column.name as keyof User] || ""}
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
