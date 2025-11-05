import { useState, useRef } from 'react';
import styles from './user.module.css';
import { useFocusOnKey } from '@hooks/useFocusOnKey';
import clsx from 'clsx';
import Master from '@components/EntryForm/Master';
import Modal from '@utils/Modal';
import { useSnackbar } from '@utils/useSnackBar';
import { useAddStore } from './useAddStore';
import { random } from 'lodash';
import { postApiCall } from '@api/base';
import { EFilterOperator } from './types';
import { DataTableContainer, IFilterInfo } from '../DataTable/DataTableContainer';

interface EntryListProps {
  list: string;
  name: string;
  list_config: any;
}

export default function EntryListNew({ list, name, list_config }: EntryListProps) {
  const { addEntry, fillform } = useAddStore();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [tableData, setTableData] = useState<any[]>([]);

  console.log('Rendering entry list new');

  // Filter state
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterOperator, setFilterOperator] = useState<EFilterOperator>(EFilterOperator.CONTAINS);
  const [activeFilters, setActiveFilters] = useState<IFilterInfo[]>([]);

  const handleRowSelect = (row: any, index: number) => {
    setSelectedRow(selectedRow === index ? -1 : index);
    setTableData((prev) => prev); // Store reference to current data
  };

  const handleAction = async (actionKey: string) => {
    const action = list_config.actionConfig[actionKey];
    if (action.actionType === 'DISPLAY_FORM') {
      try {
        const configFile = action.formConfig;
        const response = await postApiCall('http://localhost:3000/api/generic/getConfig', { configFile }, true);
        const addConfigData = response.data;

        if (actionKey === 'edit') {
          const id = tableData[selectedRow][action.payload ? action.payload[0] : 'id'];
          const data1 = await postApiCall('http://localhost:3000/api/generic/executeQuery', {
            configFile: action.formConfig,
            payload: [id],
            path: addConfigData[0].queryInfo.path
          }, true);
          addEntry(id);
          fillform(id, data1.data);
          setModalContent(<Master configFile={configFile} setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />);
        } else if (actionKey === 'add') {
          const id = tableData.length + random(1000, 9999);
          addEntry(id);
          setModalContent(<Master configFile={configFile} setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />);
        }
        setIsModalOpen(true);
      } catch (error) {
        showSnackbar('Error fetching form config');
      }
    } else if (action.actionType === 'EXECUTE_QUERY') {
      try {
        const key = action.queryInfo.payload[0];
        const payload = [tableData[selectedRow][key]];
        await postApiCall('http://localhost:3000/api/generic/executeQuery', {
          configFile: action.formConfig,
          payload,
          path: action.queryInfo.path,
          fetchquery: action.queryInfo.query,
        }, true);
        setSelectedRow(-1);
        showSnackbar('Operation completed successfully');
      } catch (error) {
        showSnackbar('Error executing operation');
      }
    }
  };

  const handleFilterApply = () => {
    if (filterColumn && filterValue) {
      const newFilter: IFilterInfo = {
        field: filterColumn,
        value: filterValue,
        operator: filterOperator,
      };
      const updatedFilters = activeFilters.filter(f => f.field !== filterColumn);
      updatedFilters.push(newFilter);
      setActiveFilters(updatedFilters);
    }
  };

  const handleClearFilter = () => {
    setFilterColumn('');
    setFilterValue('');
    setFilterOperator(EFilterOperator.CONTAINS);
    setActiveFilters([]);
  };

  const buttonRef1 = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);
  const buttonRef3 = useRef<HTMLButtonElement>(null);
  const buttonRef4 = useRef<HTMLButtonElement>(null);
  const buttonRef5 = useRef<HTMLSelectElement>(null);

  useFocusOnKey(buttonRef1, 'q');
  useFocusOnKey(buttonRef2, 'w');
  useFocusOnKey(buttonRef3, 'e');
  useFocusOnKey(buttonRef4, 'r');
  useFocusOnKey(buttonRef5, 't');

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
          
          {/* Filter UI */}
          <div className={styles.filterCard}>
            <div className={styles.filterRow}>
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className={styles.select}
                ref={buttonRef5}
              >
                <option value="">Select Column</option>
                {list_config.columns.map((col: any) => (
                  <option key={col.name} value={col.name}>{col.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Enter filter value"
                className={styles.input}
              />
              <select
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value as EFilterOperator)}
                className={styles.select}
              >
                {Object.values(EFilterOperator).map((op) => (
                  <option key={op} value={op}>
                    {op.replace(/_/g, ' ').toLowerCase()}
                  </option>
                ))}
              </select>
              <button onClick={handleFilterApply} className={styles.actionButton}>
                Apply Filter
              </button>
              <button onClick={handleClearFilter} className={clsx(styles.actionButton, styles.disabledButton)}>
                Clear Filter
              </button>
            </div>

            {activeFilters.length > 0 && (
              <div className={styles.activeFilters}>
                <p>Active Filters:</p>
                {activeFilters.map((filter, index) => (
                  <span key={index} className={styles.filterBadge}>
                    {list_config.columns.find((col: any) => col.name === filter.field)?.label}:
                    {filter.operator} "{filter.value}"
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className={styles.tableWrapper}>
            <DataTableContainer
              configFile={list}
              columns={list_config.columns}
              name={name}
              onRowSelect={handleRowSelect}
              selectedRowIndex={selectedRow}
              activeFilters={activeFilters}
            />
          </div>

          <div className={styles.buttonContainer}>
            {list_config.applicableActions.map((actionKey: string, index: number) => {
              const action = list_config.actionConfig[actionKey];
              const isDisabled = (actionKey === 'delete' || actionKey === 'edit') && selectedRow === -1;
              return (
                <button
                  key={index}
                  className={clsx(styles.actionButton, {
                    [styles.disabledButton]: isDisabled,
                  })}
                  onClick={() => handleAction(actionKey)}
                  disabled={isDisabled}
                  ref={[buttonRef1, buttonRef2, buttonRef3, buttonRef4][index]}
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
