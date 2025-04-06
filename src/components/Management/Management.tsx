/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useAddStore } from '../../useAddStore';
import Table from './Table';
import Modal from './Modal';
import styles from './Management.module.css';
import { postApiCall } from '../../api/base';
import { Column } from './MangementTypes';

interface RoleManagementProps {
  configFile: string;
  formId: string | number;
  userConfig: any;
}

export default function Management({configFile, formId, userConfig }: RoleManagementProps) {
  const { addRow ,deleteRow,updateRowField} = useAddStore();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowKeys, setRowKeys] = useState<string[]>([]);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ top: number; left: number } | null>(null);
  const [modalData, setModalData] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [columnName, setColumnName] = useState<string | null>(null);

  useEffect(() => {
// In the fetchData function in Management.tsx
const fetchData = async () => {
  const path = userConfig.queryInfo.path;
  try {
    setIsLoading(true);
    const response = await postApiCall('/api/generic/executeQuery', { configFile, payload: [formId], path }, true);
  if (!response?.data) {
      console.error('No data received from API');
      return;
    }

    const fetchedData = response.data;
    
    // Clear existing rows first to prevent duplication
    useAddStore.setState((state) => ({
      entries: {
        ...state.entries,
        [formId]: {
          ...state.entries[formId],
          rows: {},
          rowKeys: []
        }
      }
    }));
    
    // Then add the fresh data
    if (Array.isArray(fetchedData)) {
      fetchedData.forEach((entry: any) => addRow(formId, entry));
      setRowKeys(useAddStore.getState().entries[formId].rowKeys);
    } else {
      console.error('Fetched data is not an array:', fetchedData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};
    fetchData();
  }, [formId, userConfig.query]);

  const handleRowClick = (rowId: string) => {
    setSelectedRow((prev) => (prev === rowId ? null : rowId));
  };

  const handleMouseEnter = (columnName: string, event: React.MouseEvent, rowId: string) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setHoveredValue(useAddStore.getState().entries[formId].rows[rowId].originalData[columnName] as string);
    setHoveredPosition({ top: rect.top - 20, left: rect.left + rect.width / 2 });
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
    setHoveredPosition(null);
  };

  const handleInputChange = (rowId: string, columnName: string, value: string | number) => {
    updateRowField(formId, rowId, columnName, value);
  };
  



  const handledoubleclick = (rowId: string, columnName: string) => {
    const row = useAddStore.getState().entries[formId].rows[rowId];
    if (!row) return;
    const columnVal = row.updatedData[columnName] ?? row.originalData[columnName] ?? '';
    const dataArr = columnVal.toString().split(',');
    setModalData(dataArr.filter(Boolean));
    setSelectedRow(rowId);
    setColumnName(columnName);
    setModal(true);
  };

  const handleModalClick = (name: string, isChecked: boolean) => {
    const column = userConfig.columns.find((col:Column) => col.name === columnName);
    const isMulti = column?.multi ?? true;

    setModalData((prevData) => {
      if (isMulti) {
        if (isChecked) {
          return [...prevData, name];
        } else {
          return prevData.filter((item) => item !== name);
        }
      } else {
        return isChecked ? [name] : [];
      }
    });
  };

  const handleModalClose = () => {
    setModal(false);
    const str = modalData.join(',');
    if (selectedRow && columnName) {
      handleInputChange(selectedRow, columnName, str);
    }
    setModalData([]);
  };



  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  async function  handleAction (actionKey: string)  {

    if(actionKey==="ADD"){
      const newEntry: { [name: string]: string } = {
      };

      userConfig.columns.forEach((column: { name: string }) => {
        newEntry[column.name] = "";
      });

      setData([...data, newEntry]);
      addRow(
        formId,
        Object.fromEntries(
          Object.keys(newEntry).map((key) => [
            key,
            newEntry[key],
          ])
        )
      );
      setRowKeys(useAddStore.getState().entries[formId].rowKeys);
    }
    else if(actionKey==="SAVE"){
      const configFile=userConfig.actionConfig[actionKey].configFile;
      
      const selectData=useAddStore.getState().entries[formId].rows[selectedRow? selectedRow : useAddStore.getState().entries[formId].rowKeys[0]].updatedData;


      const valuesArray = Object.values(selectData);
      valuesArray.unshift(formId);


      const response = await postApiCall("/api/generic/executeQuery", { configFile: configFile, payload: valuesArray,path:userConfig.actionConfig[actionKey].queryInfo.path }, true);
     
      if (response.data?.id) {
        useAddStore.setState((state) => ({
            entries: {
                ...state.entries,
                [formId]: {
                    ...state.entries[formId],
                    rows: {
                        ...state.entries[formId].rows,
                        [selectedRow as string]: {
                            originalData: {
                                ...state.entries[formId].rows[selectedRow as string]?.originalData,
                                claim_id: response.data.id
                            },
                            updatedData: {
                                ...state.entries[formId].rows[selectedRow as string]?.updatedData,
                                claim_id: response.data.id
                            }
                        }
                    }
                }
            }
        }));
    }
    }
    else if(actionKey==="DELETE"){
      const configFile=userConfig.actionConfig[actionKey].configFile;
      const path=userConfig.actionConfig[actionKey].queryInfo.path;
      const selectedData=useAddStore.getState().entries[formId].rows[selectedRow? selectedRow : useAddStore.getState().entries[formId].rowKeys[0]].updatedData;
      const id=userConfig.actionConfig[actionKey].queryInfo.payload[0];
      const payload=[selectedData[id]];
      try {
        const response=await postApiCall("/api/generic/executeQuery", { configFile: configFile, payload: payload,path:path }, true);
        console.log(response.data);

        if (selectedRow !== null) {
          deleteRow(formId, selectedRow);
          setRowKeys(useAddStore.getState().entries[formId].rowKeys);
        }

      } catch (error) {
        console.log(error);
          
      }
      
      
    }
  }

  return (
    <div className={styles.entryListContainer}>
      <h2>{userConfig.sectionName}</h2>
      {hoveredValue && hoveredPosition && (
        <span
          className={styles.hoveredValue}
          style={{
            top: `${hoveredPosition.top}px`,
            left: `${hoveredPosition.left}px`,
            zIndex: '10000',
            position: 'absolute',
            backgroundColor: 'black',
            color: 'white',
            padding: '0',
            borderRadius: '3px',
            pointerEvents: 'none',
          }}
        >
          {hoveredValue}
        </span>
      )}
      <div className={styles.tableWrapper} >
        <Table
          formId={formId}
          rowKeys={rowKeys}
          columns={userConfig.columns || []}
          handleRowClick={handleRowClick}
          selectedRow={selectedRow}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleInputChange={handleInputChange}
          handledoubleclick={handledoubleclick}
        />
      </div>
      {modal && (
        <Modal
          modalData={modalData}
          columnName={columnName}
          userConfig={userConfig}
          handleModalClick={handleModalClick}
          handleModalClose={handleModalClose}
        />
      )}
      <div className={styles.buttonContainer}>
      {// @ts-expect-error for now
      userConfig.applicableActions.map((actionKey, index) => {
              const action = userConfig.actionConfig[actionKey as keyof typeof userConfig.actionConfig];
              return (
                <button
                  key={index}
                  className={styles.actionButton}
                  onClick={() => handleAction(actionKey)}
                >
                  {action.label}
                </button>
              );
            })}
      </div>
    </div>
  );
}
