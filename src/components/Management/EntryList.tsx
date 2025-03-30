/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import styles from './EntryList.module.css';
import Master from '../EntryForm/Master';
import Modal from '../../Utilities/Modal';
import { useSnackbar } from '../../Utilities/useSnackBar';
import useEntryListStore from '../../useEntryListStore';
import { useAddStore } from '../../useAddStore';
import { random } from 'lodash';
import { fetchData } from './fetchData';
import { EFilterOperator, ESortOrder, IFilterInfo, ISortInfo } from './types';
import ActionBar from './ActionBar';
import FilterComponent from './FilterComponenet';
import DataTable from './DataTable';
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
  
  // Filter state
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterOperator, setFilterOperator] = useState<EFilterOperator>(EFilterOperator.CONTAINS);
  const [activeFilters, setActiveFilters] = useState<IFilterInfo[]>([]);
  
  // Sort state
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<ESortOrder>(ESortOrder.ASC);
  const [activeSorts, setActiveSorts] = useState<ISortInfo[]>([]);

  const createFetchQuery = (): any => {
    const query: any = {};
    
    if (activeFilters.length > 0) {
      query.filtersData = activeFilters;
    }
    
    if (activeSorts.length > 0) {
      query.sortData = activeSorts;
    }
    
    return query;
  };

  const refreshData = () => {
    const fetchQuery = createFetchQuery();
    fetchData(
      '/api/generic/executeQuery',
      list,
      setData,
      initData,
      setLoading,
      showSnackbar,
      name,
      Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined,
    );
  };

  useEffect(() => {
    refreshData();
  }, [name, isModalOpen]);

  const handleRowClick = (rowId: number) => {
    setSelectedRow(selectedRow === rowId ? -1 : rowId);
  };

  const handleAction = async (actionKey: string) => {
    try {
      const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];
      if (!action) return;
  
      if (action.actionType === 'DISPLAY_FORM') {
        const configFile = action.formConfig;
        const response = await postApiCall('http://localhost:3000/api/generic/getConfig', { configFile }, true);
        const addConfigData = response.data;
        
        if (actionKey === 'edit') {
          const id = entries[name].data[selectedRow][action.payload?.[0] || 'id'];
          const dataResponse = await postApiCall('http://localhost:3000/api/generic/executeQuery', {
            configFile: action.formConfig,
            payload: [id],
            path: addConfigData[0].queryInfo.path,
          }, true);
  
          addEntry(id);
          fillform(id, dataResponse.data);
          setModalContent(
            <Master configFile={configFile} setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />
          );
        } else if (actionKey === 'add') {
          const id = entries[name].data.length + random(1000, 9999);
          addEntry(id);
          setModalContent(
            <Master configFile={configFile} setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />
          );
        }
        
        setIsModalOpen(true);
      } else if (action.actionType === 'EXECUTE_QUERY') {
        const key = action.queryInfo.payload[0];
        const payload = [entries[name].data[selectedRow][key]];
        
        await postApiCall('http://localhost:3000/api/generic/executeQuery', {
          configFile: action.formConfig,
          payload,
          path: action.queryInfo.path,
          fetchquery: action.queryInfo.query,
        }, true);
        
        refreshData();
        setSelectedRow(-1);
        showSnackbar('Operation completed successfully');
      }
    } catch (error) {
      showSnackbar('An error occurred while processing the request');
      console.error('Error:', error);
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
      const fetchQuery: any = {
        filtersData: updatedFilters,
        sortData: activeSorts.length > 0 ? activeSorts : undefined,
      };
      fetchData('/api/generic/executeQuery', list, setData, initData, setLoading, showSnackbar, name, fetchQuery);
    }
  };

  const handleClearFilter = () => {
    setFilterColumn('');
    setFilterValue('');
    setFilterOperator(EFilterOperator.CONTAINS);
    setActiveFilters([]);
    const fetchQuery: any = {};
    if (activeSorts.length > 0) {
      fetchQuery.sortData = activeSorts;
    }
    fetchData('/api/generic/executeQuery', list, setData, initData, setLoading, showSnackbar, name, Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
  };

  const handleSort = (field: string) => {
    console.log('Sorting by:', field);
    const newOrder = sortField === field && sortOrder === ESortOrder.ASC ? ESortOrder.DESC : ESortOrder.ASC;
    setSortField(field);
    setSortOrder(newOrder);
    const newSort: ISortInfo = { field, order: newOrder };
    setActiveSorts([newSort]);
    const fetchQuery: any = {
      sortData: [newSort],
      filtersData: activeFilters.length > 0 ? activeFilters : undefined,
    };
    fetchData('/api/generic/executeQuery', list, setData, initData, setLoading, showSnackbar, name, fetchQuery);
  };

  const handleClearSort = () => {
    setSortField('');
    setSortOrder(ESortOrder.ASC);
    setActiveSorts([]);
    const fetchQuery: any = {};
    if (activeFilters.length > 0) {
      fetchQuery.filtersData = activeFilters;
    }
    fetchData('/api/generic/executeQuery', list, setData, initData, setLoading, showSnackbar, name, Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
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
          <FilterComponent
            columns={list_config.columns}
            filterColumn={filterColumn}
            filterValue={filterValue}
            filterOperator={filterOperator}
            onFilterColumnChange={setFilterColumn}
            onFilterValueChange={setFilterValue}
            onFilterOperatorChange={setFilterOperator}
            onApplyFilter={handleFilterApply}
            onClearFilter={handleClearFilter}
            onClearSort={handleClearSort}
            hasSort={!!activeSorts.length}
          />
          
          <div className={styles.tableWrapper}>
            <DataTable
              columns={list_config.columns}
              data={entries[name]?.data || []}
              selectedRow={selectedRow}
              onRowClick={handleRowClick}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>
          <ActionBar
            actions={list_config.applicableActions}
            actionConfig={list_config.actionConfig}
            selectedRow={selectedRow}
            onAction={handleAction}
          />
        </div>
      )}
    </>
  );
}