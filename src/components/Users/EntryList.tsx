import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './user.module.css';
import clsx from 'clsx';
import RoleMaster from '../EntryForm/RoleMaster';
import Modal from '../../Utilities/Modal';
import { useSnackbar } from '../../Utilities/useSnackBar';
import useEntryListStore from '../../useEntryListStore';
import { useAddStore } from '../../useAddStore';
import { random } from 'lodash';
import { postApiCall } from '../../api/base';

interface EntryListProps {
  list: string;
  name: string;
  list_config: any;
}

export default function EntryList({ list, name, list_config }: EntryListProps) {
  const { entries, initData, setData, isLoading, setLoading, selectedRow, setSelectedRow } = useEntryListStore();
  const { addEntry, fillform } = useAddStore();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);



  const fetchData = async (url: string, config: string) => {
    console.log(name);
    initData(name);
    try {
      setLoading(true);
        const response=await postApiCall(url, { configFile: config,fetchquery: list_config.query}, true);
        console.log(name, response.data);
        setData(name, response.data || []);
        console.log(entries[name]);
    } catch (error) {
      showSnackbar('Error fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {    
    fetchData('/api/generic/executeQuery', list);
  };

  useEffect(() => {
    console.log(list_config.actionConfig['add'].formConfig,'this is it');
    refreshData();
  }, [name,isModalOpen]);

  const handleRowClick = (rowId: number) => {
    console.log(rowId);
    
    setSelectedRow(selectedRow === rowId ? -1 : rowId);
  };

  const handleAction = async (actionKey: string) => {
    const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];
    console.log(action.formConfig);

    if (action.actionType === 'DISPLAY_FORM') {
      try {
        const response = await postApiCall('http://localhost:3000/api/generic/getConfig', { configFile: list_config.actionConfig['add'].formConfig }, true);

        const addConfigData = response.data;
        console.log(addConfigData, 'addConfigData');

        if (actionKey === 'edit') {
          console.log('clicked edit');
          const id = entries[name].data[selectedRow][action.payload ? action.payload[0] : 'randomId'];
          addEntry(id);
          console.log(selectedRow);
          
          fillform(id, entries[name].data[selectedRow]);
          setModalContent(<RoleMaster setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />);
        } else if (actionKey === 'add') {
          const id = random().toString(36).substring(2, 11);
          addEntry(id);
          setModalContent(<RoleMaster setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />);
        }
        setIsModalOpen(true);
      } catch (error) {
        showSnackbar('Error fetching form config');
        console.error('Error fetching form config:', error);
      }
    } else if (action.actionType === 'EXECUTE_QUERY') {
      try{const key = action.queryInfo.payload[0] ;
      const payload = [entries[name].data[selectedRow][key]];
      const response  = await postApiCall('http://localhost:3000/api/generic/executeQuery', { configFile:"list-users", payload,path :action.queryInfo.path,fetchquery:action.queryInfo.query }, true);
      console.log(response);}
      catch(error){
        console.error('Error fetching form config:', error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <SnackbarComponent />
      {isModalOpen ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </Modal>
      ) : (
        <div className={styles.entryListContainer}>
          <h2 className={styles.title}>{name}</h2>
          <div className={styles.tableWrapper}>
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
          </div>
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