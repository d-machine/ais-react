import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./user.module.css";
import clsx from "clsx";
import RoleMaster from "../EntryForm/RoleMaster";
import Modal from "../../Utilities/Modal";
import accessToken from "../../../accesstoken";

export interface ActionConfig {
  label: string;
  actionType: string;
  formConfig?: string;
  query?: string;
  queryReturnType?: string;
  payload?: string[];
  contextParams?: string[];
  onSuccess: string;
  onFailure?: string;
}

export interface Column {
  name: string;
  label: string;
  width: number;
  sortable: boolean;
  filterType: string;
}

export interface TableConfig {
  queryReturnType: string;
  query: string;
  applyAccessLevelRestrictions: boolean;
  pagenation: boolean;
  filterable: boolean;
  sortable: boolean;
  onSuccess: string;
  onFailure: string;
  applicableActions: string[];
  actionConfig: {
    add: ActionConfig;
    edit: ActionConfig;
    delete: ActionConfig;
  };
  columns: Column[];
}

interface EntryListProps {
  list: string;
  name:string;
  list_config: TableConfig;
  
}

export default function EntryList({ list,name, list_config }: EntryListProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const fetchData = async (url: string, config: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        url,
        { configFile: config },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchData("http://localhost:3000/api/generic/executeQuery", list);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleRowClick = (rowId: number) => {
    setSelectedRow((prev) => (prev === rowId ? null : rowId));
  };

  const handleAction = async (actionKey: string) => {
    const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];

    if (action.actionType === "DISPLAY_FORM") {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/generic/getConfig",
          { configFile: action.formConfig },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const addConfigData = response.data;
        setModalContent(<RoleMaster formId="random_id" addConfig={addConfigData} />);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error fetching form config:", error);
      }
    } else if (action.actionType === "EXECUTE_QUERY") {
      if (action.query) {
        try {
          setIsLoading(true);
          await axios.post("http://localhost:5000/delete_role", {
            query: action.query,
            payload: [selectedRow],
          });
          refreshData();
        } catch (error) {
          console.error("Error executing query:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isModalOpen? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </Modal>
      ):( <div className={styles.entryListContainer}>
        <h2>{name}</h2>
        <table className={styles.entryTable}>
          <thead>
            <tr>
              {list_config.columns.map((column) => (
                <th key={column.name} style={{ width: `${column.width}px` }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.role_id}
                className={clsx(styles.entryListItem, {
                  [styles.selectedRow]: selectedRow === entry.role_id,
                })}
                onClick={() => handleRowClick(entry.role_id)}
              >
                {list_config.columns.map((column) => (
                  <td key={column.name} className={styles.entryListCell}>
                    {entry[column.name as keyof any] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.buttonContainer}>
          {list_config.applicableActions.map((actionKey, index) => {
            const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];
            return (
              <button
                key={index}
                className={styles.actionButton}
                onClick={() => handleAction(actionKey)}
                disabled={(actionKey === "delete" || actionKey === "edit") && !selectedRow}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>)}
     
    </>
  );
}
