
import { useEffect, useState } from "react";
import styles from "./RoleManagement.module.css";
import clsx from "clsx";
import { useStore } from "../../store1";

interface Section {
  sectionType: string;
  sectionName: string;
  queryReturnType: string;
  query: string;
  payload: string[];
  applicableActions: string[];
  actionConfig: ActionConfig;
  fields?: Field[];
  columns?: Column[];
}
interface ActionConfig {
  [key: string]: Action;
}

interface Action {
  label: string;
  actionType: string;
  query?: string;
  queryReturnType?: string;
  payload?: string[];
  contextParams?: string[];
  functionName?: string;
  onSuccess?: string;
  onFailure?: string;
}

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  query?: string;
  disabled?: boolean;
}

interface Column {
  name: string;
  label: string;
  type: string;
  multi?: boolean;
  selectConfig?: SelectConfig;
}

interface SelectConfig {
  selectHandler: string;
  currentSelection: Selection[];
  selectParser: string;
  columns: { id: string; name: string };
  options: Option[];
  fields_to_extract: Selection[];
}

interface Selection {
  key: string;
  as: string;
}

interface Option {
  id: string;
  name: string;
}

interface EntryListProps {
  formId: string;
  userConfig: Section;
}

interface Roles {
  resource: string;
  access_type: string;
  access_level: string;
}

export default function RoleManagement({ formId, userConfig }: EntryListProps) {
  const { addRow, deleteRow, saveRow, resetRow, resetAllRows, addAfter } =
    useStore();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [data, setData] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowKeys, setRowKeys] = useState<string[]>([]);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [modalData, setModalData] = useState<string[]>([]);

  const [modal, setModal] = useState(false);

  const [columnName, setColumnName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const query = userConfig.query;
        console.log(query);

        const response = await fetch("http://localhost:5000/execute_query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });
        const fetchedData = await response.json();
        console.log(fetchedData);
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
    fetchData();
  },[]);

  const handledoubleclick = (rowId: string, columnName: string) => {
    const row = useStore.getState().entries[formId].rows[rowId];
    const columnVal= row.updatedData[columnName];
    const dataarr = columnVal.toString().split(",");
    setModalData(dataarr);
    setSelectedRow(rowId);
    setColumnName(columnName);
    setModal(true);
  };

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
      const tdList = document.querySelectorAll(`tr.${selectedRow} td`);
      tdList.forEach((td) => {
        td.classList.remove(styles.change);
      });
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

    setHoveredValue(
      useStore.getState().entries[formId].rows[rowId].originalData[
        columnName as keyof Roles
      ] as string
    );
    setHoveredPosition({
      top: rect.top - 20,
      left: rect.left + rect.width / 2,
    });
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
    setHoveredPosition(null);
  };

  const handleModalClick = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    name: string
  ) => {
    const target = event.currentTarget;
    console.log("hi");

    target.classList.toggle("selected-row");
    setModalData((prevData) => {
      const exists = prevData.includes(name);
      if (exists) {
        return prevData.filter((item) => item !== name);
      } else {
        return [...prevData, name];
      }
    });
  };

  const handleModalClose = () => {
    setModal(false);
    const str = modalData.join(",");
    console.log(str);

    if (selectedRow !== null && columnName !== null) {
      handleInputChange(selectedRow, columnName, str);
    }
    modalData.length = 0;
  };

  if (modal) {
    return (
      <div className={styles.modal}>
        <div className={styles.modal_content}>
          <div className={styles.modal_header}>
            <button
              className={styles.close_button}
              onClick={() => handleModalClose()}
            >
              X
            </button>
          </div>
          <div className={styles.modal_body}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>Name</th>
                </tr>
              </thead>
              <tbody>
                {userConfig.columns
                  ?.filter((column) => column.name === columnName)
                  .map((column) =>
                    column.selectConfig?.options?.map((option) => (
                      <tr
                        key={option.id}
                        style={{ cursor: "pointer", padding: "10px" }}
                      >
                        <td
                          style={{
                            textAlign: "center",
                            backgroundColor: modalData.includes(option.name) ? "red" : "white", 
                          }}
                          onClick={(event) => {
                            console.log(option.name);
                            handleModalClick(event, option.name);
                          }}
                        >
                          {option.name}
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className={styles.entryListContainer}>
      <h2>Role Management</h2>
      {hoveredValue && hoveredPosition && (
        <span
          className={styles.hoveredValue}
          style={{
            top: `${hoveredPosition.top}px`,
            left: `${hoveredPosition.left}px`,
            zIndex:"10000",
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
      <div className={styles.tableWrapper}>
      <table className={styles.entryTable}>
        <thead >
          <tr>
            {userConfig.columns?.map((column) => (
              <th className={styles.stick} key={column.name} style={{ width: `400px` }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody >
          {rowKeys.map((rowId) => {
            const entry =
              useStore.getState().entries[formId].rows[rowId].updatedData;
            return (
              <tr
                key={rowId}
                className={clsx(`${rowId}`, styles.entryListItem, {
                  [styles.selectedRow]: selectedRow === rowId,
                })}
                onClick={() => handleRowClick(rowId)}
              >
                {userConfig.columns?.map((column) => (
                  <td
                    key={column.name}
                    data-column={column.name}
                    className={styles.entryListCell}
                    onMouseEnter={(e) =>
                      handleMouseEnter(column.name, e, rowId)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {column.type === "TEXT" ? (
                      <input
                        style={{ width: "100%" }}
                        type="text"
                        value={entry[column.name as keyof Roles] || ""}
                        onChange={(e) => {
                          const td = e.target.closest("td");
                          if (td) td.classList.add(styles.change);
                          handleInputChange(rowId, column.name, e.target.value);
                        }}
                      />
                    ) : column.type === "SELECT" ? (
                      <input
                        readOnly
                        onDoubleClick={(e) => {
                          handledoubleclick(rowId, column.name);
                          console.log(e);
                        }}
                        style={{ width: "100%" }}
                        type="text"
                        value={entry[column.name as keyof Roles] || ""}
                        />
                      ) : null}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
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
        <button disabled={!selectedRow} onClick={handleSave}>
          save
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              resetRow(formId, selectedRow);
              const tdList = document.querySelectorAll(`tr.${selectedRow} td`);
              tdList.forEach((td) => {
                td.classList.remove(styles.change);
              });
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
            const tdList = document.querySelectorAll("td");
            tdList.forEach((td) => {
              td.classList.remove(styles.change);
            });
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
