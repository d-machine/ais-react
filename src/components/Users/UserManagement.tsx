// UserManagement.tsx
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import clsx from "clsx";
import { useAddStore } from "../../useAddStore";
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
}

export default function UserManagement({ userConfig }: EntryListProps) {
  const {
    addEntry,
    addRow,
    deleteRow,
    saveRow,
    resetRow,
    resetAllRows,
    addAfter,
  } = useAddStore();
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
        setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const currentState = useAddStore.getState();
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

  const handleInputChange = (
    rowId: string,
    columnName: string,
    value: string | number
  ) => {
    useAddStore.setState((state) => {
      const updatedRows = {
        ...state.entries[userConfig.onLoad].rows,
        [rowId]: {
          ...state.entries[userConfig.onLoad].rows[rowId],
          updatedData: {
            ...state.entries[userConfig.onLoad].rows[rowId].updatedData,
            [columnName]: value,
          },
        },
      };

      return {
        entries: {
          ...state.entries,
          [userConfig.onLoad]: {
            ...state.entries[userConfig.onLoad],
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
      saveRow(userConfig.onLoad, selectedRow);
      setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
    }
  };


  const handleMouseEnter = (
    columnName: string,
    event: React.MouseEvent,
    rowId: string 
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    setHoveredValue(useAddStore.getState().entries[userConfig.onLoad].rows[rowId].originalData[columnName as keyof User] as string);
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
              useAddStore.getState().entries[userConfig.onLoad].rows[rowId].updatedData;
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
                    handleMouseEnter(column.name, e, rowId) // Pass rowId here
                  }
                  onMouseLeave={() => handleMouseLeave(rowId)}
                  >
                    <input
                        type="text"
                        value={entry[column.name as keyof User] || ""}
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
          {/* {data.map((entry, index) => (
            <tr
              key={entry.email}
              className={clsx(styles.entryListItem, {
                [styles.selectedRow]: selectedRow === entry.email,
              })}
              onClick={() => handleRowClick(entry.email)}
            >
              {userConfig.columns.map((column) => (
                <td key={column.name}>
                  <input
                    type="text"
                    value={entry[column.name as keyof User] || ''}
                    onChange={(e) => handleInputChange(index, column.name, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))} */}
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => {
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
            addRow(
              userConfig.onLoad,
              Object.fromEntries(
                Object.keys(newUser).map((key) => [
                  key,
                  newUser[key as keyof User],
                ])
              )
            );
            setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
          }}
        >
          Add New
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              deleteRow(userConfig.onLoad, selectedRow);
              setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
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
              resetRow(userConfig.onLoad, selectedRow);
              const tdList=document.querySelectorAll(`tr.${selectedRow} td`);
              tdList.forEach((td)=>{
                td.classList.remove(styles.change);
              })
              setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
            }
          }}
        >
          ResetRow
        </button>
        <button
          onClick={() => {
            resetAllRows(userConfig.onLoad);
            setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
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
              const newUser: User = {
                username: "",
                email: "",
                full_name: "",
                reports_to: "",
                roles: "",
                last_updated_by: "",
                last_updated_at: new Date().toISOString(),
              };
              addAfter(
                userConfig.onLoad,
                Object.fromEntries(
                  Object.keys(newUser).map((key) => [
                    key,
                    newUser[key as keyof User],
                  ])
                ),
                selectedRow
              );
              setRowKeys(useAddStore.getState().entries[userConfig.onLoad].rowKeys);
            }
          }}
        >
          add After
        </button>
        <button onClick={() => console.log(useAddStore.getState())}>
          show store
        </button>
      </div>
    </div>
  );
}
