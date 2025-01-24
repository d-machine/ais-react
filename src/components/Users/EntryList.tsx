import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './user.module.css';
import clsx from 'clsx';
import RoleMaster from '../EntryForm/RoleMaster';
import Modal from '../../Utilities/Modal';
import accessToken from '../../../accesstoken';
import useEntryListStore from '../../useEntryListStore';
import { useAddStore } from '../../useAddStore';
import { TableConfig } from './types';
import { random } from 'lodash';

interface EntryListProps {
  list: string;
  name: string;
  list_config: TableConfig;
}

export default function EntryList({ list, name, list_config }: EntryListProps) {
  const { entries, initData, setData, isLoading, setLoading, selectedRow, setSelectedRow } = useEntryListStore();
  const {addEntry,fillform}=useAddStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const fetchData = async (url: string, config: string) => {
    console.log(name); 
    initData(name);
    try {
      setLoading(true);
      if(config==="list-roles"){
        const response=await axios.get('http://localhost:4500/roles');
        console.log(name, response.data);
        setData(name, response.data || []);
      }
      else{
        const response = await axios.post(
          url,
          { configFile: config },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(name, response.data);
      setData(name, response.data || []);
      }
      
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData('http://localhost:3000/api/generic/executeQuery', list);
  };

  useEffect(() => {
    refreshData();
  }, [name]);

  const handleRowClick = (rowId: number) => {
    setSelectedRow(selectedRow === rowId ? -1 : rowId);
  };

  const handleAction = async (actionKey: string) => {
    const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];
    console.log(action.formConfig);
    
    if (action.actionType === 'DISPLAY_FORM') {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/generic/getConfig',
          { configFile: list_config.actionConfig["add"].formConfig },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const addConfigData = response.data;
        console.log(addConfigData);
        
        if(actionKey === 'edit') {
          console.log("clicked edit");
          
          const id=entries[name].data[selectedRow][action.payload? action.payload[0]:"randomId"];
          addEntry(id);
          fillform(id,entries[name].data[selectedRow]);
          setModalContent(<RoleMaster formId={id} addConfig={addConfigData} />);
        }
        else if(actionKey === 'add') {
          const id=random().toString(36).substring(2, 11);
          addEntry(id);
          setModalContent(<RoleMaster formId={id} addConfig={addConfigData} />);
        }
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error fetching form config:', error);
      }
    } else if (action.actionType === 'EXECUTE_QUERY') {
      if (action.query) {
        try {
          setLoading(true);
          await axios.post('http://localhost:5000/delete_role', {
            query: action.query,
            payload: [selectedRow],
          });
          refreshData();
        } catch (error) {
          console.error('Error executing query:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isModalOpen ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </Modal>
      ) : (
        <div className={styles.entryListContainer}>
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
              {entries[name]?.data?.map((entry, index) => (
                <tr
                  key={index}
                  className={clsx(styles.entryListItem, {
                    [styles.selectedRow]: selectedRow === index,
                  })}
                  onClick={() => handleRowClick(index)}
                >
                  {list_config.columns.map((column) => (
                    <td key={column.name} className={styles.entryListCell}>
                      {entry[column.name] || ''}
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
                  disabled={(actionKey === 'delete' || actionKey === 'edit') && selectedRow === -1}
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
