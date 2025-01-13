import React, { useEffect, useState } from 'react';
import styles from '../../Utilities/EntryList.module.css';
import clsx from 'clsx';
import UserMaster from '../EntryForm/UserMaster';
import { useStore } from '../../store';
// import { useStore } from '../../store';
// import ItemMaster from '../../components/EntryForm/ItemMaster';

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
  

interface EntryListProps {
  setModalContent: (content: React.ReactNode) => void;
  setisopen: (isOpen: boolean) => void;
  userConfig: UserConfig
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
export default function UserManagement ({userConfig,setModalContent, setisopen}: EntryListProps){

    const [selectedRow, setSelectedRow] = useState<string | null>(null);


//   const [selectedId, setSelectedId] = useState<number | null>(null);
//     const handleRadioChange = (id: number) => {
//     setSelectedId(prevSelectedId => (prevSelectedId === id ? null : id));
//   };
//   const handleEdit = (id: number): void => {
//     const data = entries.filter((entry) => entry.id === id);
//     console.log(data[0], "data");
//     const formId = `ab${id.toString()}`;
//     const currentState = useStore.getState();
//     if (!currentState.entries[formId]) {
//       currentState.addEntry(formId);
//       currentState.setFormData(formId, 'itemcode', data[0].itemcode);
//       currentState.setFormData(formId, 'itemdescription', data[0].itemdescription);
//       currentState.setFormData(formId, 'conversion', data[0].conversion);
//       currentState.setFormData(formId, 'itemcategory', data[0].itemcategory);
//       currentState.setFormData(formId, 'itembrand', data[0].itembrand);
//       currentState.setFormData(formId, 'palletcapacity', data[0].palletcapacity);
//       currentState.setFormData(formId, 'id', data[0].id);
//     }
//     setModalContent(<ItemMaster formId={formId} />);
//     setisopen(true);
//   };
//   const handleAddNew = (): void => {
//     const formId = `ab${entries.length + 1}`;
//     const currentState = useStore.getState();
//     if (!currentState.entries[formId]) {
//       currentState.addEntry(formId);
//     }
//     setModalContent(<ItemMaster formId={formId} />);
//     setisopen(true);
//   }
//   const handleCopy = (id: number): void => {
//     const data = entries.filter((entry) => entry.id === id);
//     console.log(data[0], "data");
//     const formId = `copy${id.toString()}`;
//     const currentState = useStore.getState();
//     if (!currentState.entries[formId]) {
//       currentState.addEntry(formId);
//       currentState.setFormData(formId, 'itemcode', data[0].itemcode);
//       currentState.setFormData(formId, 'itemdescription', data[0].itemdescription);
//       currentState.setFormData(formId, 'conversion', data[0].conversion);
//       currentState.setFormData(formId, 'itemcategory', data[0].itemcategory);
//       currentState.setFormData(formId, 'itembrand', data[0].itembrand);
//       currentState.setFormData(formId, 'palletcapacity', data[0].palletcapacity);
//     }
//     setModalContent(<ItemMaster formId={formId} />);
//     setisopen(true);
//   };
 const [data, setData] = useState<User[]>([]);
    useEffect(() => {
        async function fetchData() {
            const url=`http://localhost:5000/${userConfig.onLoad}`;
            console.log(url, "url");
            const response = await fetch(url);
            const data = await response.json();
            console.log(data, "data");
            
            setData(data);
        }
        fetchData();
    },[]);

    const handleRowClick = (email: string) => {
        setSelectedRow((prev) => (prev === email ? null : email));
      };

      const handleActionClick = (action: string) => {
          switch (action) {
        case 'add':{
            console.log("clicked");  
            const formId=`ab${data.length + 1}`;
            const currentState = useStore.getState();
            if (!currentState.entries[formId]) {
            currentState.addEntry(formId);
            }
              setModalContent(<UserMaster formId={formId} />);
              setisopen(true);}
              break;
            case 'edit':
                {const entry = data.filter((entry) => entry.email === selectedRow);
                const formId = `ab${entry[0].email}`;
                const currentState = useStore.getState();
                if (!currentState.entries[formId]) {
                currentState.addEntry(formId);
                currentState.setFormData(formId, 'email', entry[0].email);
                currentState.setFormData(formId, 'username', entry[0].username);
                currentState.setFormData(formId, 'full_name', entry[0].full_name);
                currentState.setFormData(formId, 'reports_to', entry[0].reports_to);
                currentState.setFormData(formId, 'roles', entry[0].roles);
                currentState.setFormData(formId, 'last_updated_by', entry[0].last_updated_by);
                currentState.setFormData(formId, 'last_updated_at', entry[0].last_updated_at);
                }
                setModalContent(<UserMaster formId={formId} />);
                setisopen(true);
                }
              break;
            case 'Copy':{
                const entry = data.filter((entry) => entry.email === selectedRow);
                const formId = `copy${entry[0].email}`;
                const currentState = useStore.getState();
                if (!currentState.entries[formId]) {
                currentState.addEntry(formId);
                currentState.setFormData(formId, 'email', entry[0].email);
                currentState.setFormData(formId, 'username', entry[0].username);
                currentState.setFormData(formId, 'full_name', entry[0].full_name);
                currentState.setFormData(formId, 'reports_to', entry[0].reports_to);
                currentState.setFormData(formId, 'roles', entry[0].roles);
                currentState.setFormData(formId, 'last_updated_by', entry[0].last_updated_by);
                currentState.setFormData(formId, 'last_updated_at', entry[0].last_updated_at);
                }
                setModalContent(<UserMaster formId={formId} />);
                setisopen(true);
            }
              break;
            case 'Delete':
              // handleDelete(email);
              break;
            default:
              break;
          }
      };

return (
    <>
    <div className={styles.entryListContainer}>
      <h2>Entry List</h2>
      <table className={styles.entryTable}>
        <thead>
          <tr>
          {userConfig.columns.map((column) => (
            <th key={column.name}>{column.label}</th>
        ))}
          </tr>
        </thead>
        <tbody>
          {data.map(entry => (
             <tr
             key={entry.email}
             className={clsx(styles.entryListItem, {
               [styles.selectedRow]: selectedRow === entry.email,
             })} 
             onClick={() => handleRowClick(entry.email)}
           >
              <td>{entry.username}</td>
              <td>{entry.email}</td>
              <td>{entry.full_name}</td>
              <td>{entry.reports_to}</td>
              <td>{entry.roles}</td>
              <td>{entry.last_updated_by}</td>
              <td>{entry.last_updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
  {
    userConfig.applicableActions.map((action) => (
      <button 
        key={action} 
        disabled={action !== "add" && !selectedRow} 
        onClick={() => handleActionClick(action)}
      >
        {action}
      </button>
    ))
  }
</div>

    </div>
    </>
  );
};


// const userConfig = {
//     applyAccessLevelRestrictions: false,
//     onLoad: "executeQuery",
//     onLoadParams: ["resource_id", "list"],
//     "query-file": "list-query",
//     pagenation: true,
//     filterable: true,
//     sortable: true,
//     applicableActions: ["add", "edit", "changePassword", "delete"],
//     actionConfig: {
//       add: {
//         label: "Add New User",
//         onPress: "displayForm",
//         "form-config": "add",
//         onComplete: "refresh",
//       },
//       edit: {
//         label: "Edit User",
//         onPress: "dispayForm",
//         onPressParams: ["user_id"],
//         "form-config": "edit",
//         onComplete: "refresh",
//       },
//       changePassword: {
//         label: "Change Password",
//         onPress: "displayForm",
//         onPressParams: ["user_id"],
//         "form-config": "change-password",
//         onComplete: "refresh",
//       },
//       delete: {
//         label: "Delete User",
//         onPress: "executeQuery",
//         query: "CALL delete_user($1, $2)",
//         onPressParams: ["user_id"],
//         "context-params": ["current_user_id"],
//         onComplete: "refresh",
//       },
//     },
//     columns: [
//       {
//         name: "username",
//         label: "Username",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//       {
//         name: "email",
//         label: "Email",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//       {
//         name: "full_name",
//         label: "Full Name",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//       {
//         name: "reports_to",
//         label: "Reports To",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//       {
//         name: "roles",
//         label: "Roles",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//       {
//         name: "last_updated_by",
//         label: "Last Updated By",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//       {
//         name: "last_updated_at",
//         label: "Last Updated At",
//         width: 200,
//         sortable: true,
//         filterType: "string",
//       },
//     ],
//   };