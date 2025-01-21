// UserManagement.tsx
import { useEffect, useState } from "react";
import styles from "./user.module.css";
import clsx from "clsx";
import RoleMaster from "../EntryForm/RoleMaster";
import Modal from '../../Utilities/Modal';


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

interface Roles{
    role_id: number;
    role_name: string;
    description: string;
    last_updated_by: string;
    last_updated_at: string
  };


  
interface EntryListProps {
  list_config: TableConfig;

}

export default function RoleEntryList({list_config }: EntryListProps) {

  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [data, setData] = useState<Roles[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  // Fetch data function
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const query = list_config.query;

      const response = await fetch('http://localhost:5000/get_roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const fetchedData = await response.json();
      setData(fetchedData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);  
  const handleRowClick = (rowId: number) => {
    setSelectedRow((prev) => (prev === rowId ? null : rowId));
  };

  const handleAction =async (actionKey: string) => {
    const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];
    if (action.actionType === "DISPLAY_FORM") {
        const add_list_config=await fetch("http://localhost:5000/add_list");
        const add_list_config_data=await add_list_config.json();
      if (action.formConfig === "add-role") {
        setModalContent(<RoleMaster formId={"random_id"} addConfig={add_list_config_data}/>);
        setIsModalOpen(true);
      } else if (action.formConfig === "edit-role") {
        setModalContent(<RoleMaster formId={`${selectedRow}`} addConfig={add_list_config_data}/>);
        setIsModalOpen(true);
      }
    } else if (action.actionType === "EXECUTE_QUERY") {
      if (action.query ) {
        const { query } = action;
        const payload= [selectedRow];
        const fetchDataForQuery = async () => {
          try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/delete_role', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query, payload }),
            });
            if (!response.ok) {
              throw new Error(`Server responded with status: ${response.status}`);
            }
            const fetchedData = await response.json();
            console.log(fetchedData);
            refreshData();
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchDataForQuery();
      }
    }
  };
  const refreshData = () => {
    fetchData();  
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {isModalOpen ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>{modalContent}</Modal>
      ) : (
    <div className={styles.entryListContainer}>
      <h2>User Management</h2>
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
              className={clsx(`${entry.role_id}`, styles.entryListItem, {
                [styles.selectedRow]: selectedRow === entry.role_id,
              })}
              onClick={() => handleRowClick(entry.role_id)}
              >
              {list_config.columns.map((column) => (
                <td key={column.name} className={styles.entryListCell}>
                  {entry[column.name as keyof Roles] || ""}
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
    </div>
      )}
  </>
  );
}
