import { useEffect, useState } from 'react';
import { useAddStore } from '../../useAddStore';
import RoleTable from './RoleTable';
import RoleModal from './RoleModal';
import styles from './RoleManagement.module.css';
import { Section } from './RoleMangementTypes';

interface RoleManagementProps {
  formId: string;
  userConfig: Section;
}

export default function RoleManagement({ formId, userConfig }: RoleManagementProps) {
  const { addRow, deleteRow, saveRow, resetRow, resetAllRows } = useAddStore();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowKeys, setRowKeys] = useState<string[]>([]);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ top: number; left: number } | null>(null);
  const [modalData, setModalData] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [columnName, setColumnName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/execute_query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userConfig.query }),
        });
        const fetchedData = await response.json();
        fetchedData.forEach((entry: any) => addRow(formId, entry));
        setRowKeys(useAddStore.getState().entries[formId].rowKeys);
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
    useAddStore.setState((state) => {
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

  const handledoubleclick = (rowId: string, columnName: string) => {
    const row = useAddStore.getState().entries[formId].rows[rowId];
    const columnVal = row.updatedData[columnName];
    if (columnVal === undefined) {
      console.error(`Column ${columnName} does not exist in row ${rowId}`);
      return;
    }
    const dataarr = columnVal.toString().split(',');
    setModalData(dataarr);
    setSelectedRow(rowId);
    setColumnName(columnName);
    setModal(true);
  };

  const handleModalClick = (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>, name: string) => {
    const target = event.currentTarget;
    target.classList.toggle('selected-row');
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
    const str = modalData.join(',');
    if (selectedRow !== null && columnName !== null) {
      handleInputChange(selectedRow, columnName, str);
    }
    modalData.length = 0;
  };

  // const handleSave = () => {
  //   if (selectedRow) {
  //     const tdList = document.querySelectorAll(`tr.${selectedRow} td`);
  //     tdList.forEach((td) => td.classList.remove(styles.change));
  //     saveRow(formId, selectedRow);
  //     setRowKeys(useAddStore.getState().entries[formId].rowKeys);
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
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
      <div className={styles.tableWrapper}>
        <RoleTable
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
        <RoleModal
          modalData={modalData}
          columnName={columnName}
          userConfig={userConfig}
          handleModalClick={handleModalClick}
          handleModalClose={handleModalClose}
        />
      )}
      {/* <div className={styles.buttonContainer}>
        <button
          onClick={() => {
            const newUser: { [key: string]: string } = {};
            setData([...data, newUser]);
            addRow(
              formId,
              Object.fromEntries(Object.keys(newUser).map((key) => [key, newUser[key]]))
            );
            setRowKeys(useAddStore.getState().entries[formId].rowKeys);
          }}
        >
          Add New
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              deleteRow(formId, selectedRow);
              setRowKeys(useAddStore.getState().entries[formId].rowKeys);
              setSelectedRow(null);
            }
          }}
        >
          Delete
        </button>
        <button disabled={!selectedRow} onClick={handleSave}>
          Save
        </button>
        <button
          disabled={!selectedRow}
          onClick={() => {
            if (selectedRow) {
              resetRow(formId, selectedRow);
              const tdList = document.querySelectorAll(`tr.${selectedRow} td`);
              tdList.forEach((td) => td.classList.remove(styles.change));
              setRowKeys(useAddStore.getState().entries[formId].rowKeys);
            }
          }}
        >
          Reset Row
        </button>
        <button
          onClick={() => {
            resetAllRows(formId);
            setRowKeys(useAddStore.getState().entries[formId].rowKeys);
            const tdList = document.querySelectorAll('td');
            tdList.forEach((td) => td.classList.remove(styles.change));
          }}
        >
          Reset All
        </button>
        <button onClick={() => console.log(useAddStore.getState())}>
          Show Store
        </button>
      </div> */}
      <div className={styles.buttonContainer}>
      {userConfig.applicableActions.map((actionKey, index) => {
              const action = userConfig.actionConfig[actionKey as keyof typeof userConfig.actionConfig];
              return (
                <button
                  key={index}
                  className={styles.actionButton}
                >
                  {action.label}
                </button>
              );
            })}
      </div>
    </div>
  );
}
