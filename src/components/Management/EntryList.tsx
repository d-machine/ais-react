import { useEffect, useState } from 'react';
import styles from './user.module.css';
import clsx from 'clsx';
import Master from '../EntryForm/Master';
import Modal from '../../Utilities/Modal';
import { useSnackbar } from '../../Utilities/useSnackBar';
import useEntryListStore from '../../useEntryListStore';
import { useAddStore } from '../../useAddStore';
import { random } from 'lodash';
import { postApiCall } from '../../api/base';
import { EFilterOperator, ESortOrder } from './types';

export interface ISortInfo {
  field: string;
  order: ESortOrder;
}

export interface IPaginationInfo {
  offset: number;
  limit: number;
}

export interface IFilterInfo {
  field: string;
  value: string;
  operator?: EFilterOperator;
}

export interface IFetchQuery {
  sortData?: ISortInfo[];
  paginationData?: IPaginationInfo;
  filtersData?: IFilterInfo[];
}

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

  const fetchData = async (url: string, config: string, fetchQuery?: IFetchQuery) => {
    console.log(name);
    console.log('fetchQuery', fetchQuery);
    initData(name);
    try {
      setLoading(true);
      const response = await postApiCall(url, {
        configFile: config,
        fetchQuery,
      }, true);
      console.log(name, response.data);
      setData(name, response.data || []);
    } catch (error) {
      showSnackbar('Error fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to create combined fetch query using current filters and sorts
  const createFetchQuery = (): IFetchQuery => {
    const query: IFetchQuery = {};
    
    if (activeFilters.length > 0) {
      query.filtersData = activeFilters;
    }
    
    if (activeSorts.length > 0) {
      query.sortData = activeSorts;
    }
    
    return query;
  };

  const refreshData = () => {
    // Always use the current filter and sort settings when refreshing
    const fetchQuery = createFetchQuery();
    fetchData('/api/generic/executeQuery', list, Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
  };

  useEffect(() => {
    refreshData();
  }, [name, isModalOpen]);

  const handleRowClick = (rowId: number) => {
    setSelectedRow(selectedRow === rowId ? -1 : rowId);
  };

  const handleAction = async (actionKey: string) => {
    const action = list_config.actionConfig[actionKey as keyof typeof list_config.actionConfig];
    if (action.actionType === 'DISPLAY_FORM') {
      try {
        const configFile = list_config.actionConfig[actionKey].formConfig;
        const response = await postApiCall('http://localhost:3000/api/generic/getConfig', { configFile }, true);
        const addConfigData = response.data;
        console.log(addConfigData[0].queryInfo.path);
        
        if (actionKey === 'edit') {
          console.log(action,"action");
          const id = entries[name].data[selectedRow][action.payload ? action.payload[0] : 'id'];
          console.log(id);
          console.log(action.formConfig,[id],addConfigData[0].queryInfo.path);
          const data1=await postApiCall('http://localhost:3000/api/generic/executeQuery', {
          configFile:action.formConfig,payload:[id],path:addConfigData[0].queryInfo.path} ,true);
          console.log(data1.data);
          addEntry(id);
          fillform(id, data1.data);
          setModalContent(<Master configFile={configFile} setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />);
        } else if (actionKey === 'add') {
          const id = entries[name].data.length + random(1000, 9999);
          addEntry(id);
          setModalContent(<Master configFile={configFile} setIsModalOpen={setIsModalOpen} formId={id} addConfig={addConfigData} />);
        }
        setIsModalOpen(true);
      } catch (error) {
        showSnackbar('Error fetching form config');
        console.error('Error fetching form config:', error);
      }
    } else if (action.actionType === 'EXECUTE_QUERY') {
      try {
        const key = action.queryInfo.payload[0];
        const payload = [entries[name].data[selectedRow][key]];
        const response = await postApiCall('http://localhost:3000/api/generic/executeQuery', {
          configFile: action.formConfig,
          payload,
          path: action.queryInfo.path,
          fetchquery: action.queryInfo.query,
        }, true);
        console.log(response);
        refreshData();
        setSelectedRow(-1);
        showSnackbar('Operation completed successfully');
      } catch (error) {
        console.error('Error executing query:', error);
        showSnackbar('Error executing operation');
      }
    }
  };

  const handleFilterApply = () => {
    if (filterColumn && filterValue) {
      // Create the new filter
      const newFilter: IFilterInfo = {
        field: filterColumn,
        value: filterValue,
        operator: filterOperator,
      };
      
      // Update active filters (replace if same column, otherwise add)
      const updatedFilters = activeFilters.filter(f => f.field !== filterColumn);
      updatedFilters.push(newFilter);
      setActiveFilters(updatedFilters);
      
      // Create fetch query with both filters and sorts
      const fetchQuery: IFetchQuery = {
        filtersData: updatedFilters,
        sortData: activeSorts.length > 0 ? activeSorts : undefined,
      };
      
      fetchData('/api/generic/executeQuery', list, fetchQuery);
    }
  };

  const handleClearFilter = () => {
    // Clear filter form state
    setFilterColumn('');
    setFilterValue('');
    setFilterOperator(EFilterOperator.CONTAINS);
    setActiveFilters([]);
    
    // Only include sort data if it exists
    const fetchQuery: IFetchQuery = {};
    if (activeSorts.length > 0) {
      fetchQuery.sortData = activeSorts;
    }
    
    // Fetch data with just sort parameters (or no parameters if no sorts)
    fetchData('/api/generic/executeQuery', list, Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
  };

  const handleSort = (field: string) => {
    console.log('Sorting by:', field);
    
    // Determine the new sort order
    const newOrder = 
      sortField === field && sortOrder === ESortOrder.ASC
        ? ESortOrder.DESC
        : ESortOrder.ASC;
    
    // Update sort state
    setSortField(field);
    setSortOrder(newOrder);
    
    // Create or update sort info
    const newSort: ISortInfo = { field, order: newOrder };
    setActiveSorts([newSort]); // Only one sort field supported at a time
    
    // Create fetch query with both filters and the new sort
    const fetchQuery: IFetchQuery = {
      sortData: [newSort],
      filtersData: activeFilters.length > 0 ? activeFilters : undefined,
    };
    
    fetchData('/api/generic/executeQuery', list, fetchQuery);
  };

  const handleClearSort = () => {
    // Clear sort state
    setSortField('');
    setSortOrder(ESortOrder.ASC);
    setActiveSorts([]);
    
    // Create fetch query with just filters (if any)
    const fetchQuery: IFetchQuery = {};
    if (activeFilters.length > 0) {
      fetchQuery.filtersData = activeFilters;
    }
    
    // Fetch data with just filter parameters (or no parameters if no filters)
    fetchData('/api/generic/executeQuery', list, Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
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
          {/* Filter UI */}
          <div className={styles.filterCard}>
            <div className={styles.filterRow}>
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className={styles.select}
              >
                <option value="">Select Column</option>
                {list_config.columns
                  .map((col: any) => (
                    <option key={col.name} value={col.name}>
                      {col.label}
                    </option>
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
              {activeSorts.length > 0 && (
                <button onClick={handleClearSort} className={styles.actionButton}>
                  Clear Sort
                </button>
              )}
            </div>
            
            {/* Active Filters Display */}
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
          
          <div className={styles.tableWrapper}>
            <table className={styles.entryTable}>
              <thead>
                <tr>
                  {list_config.columns.map((column: any) => (
                    <th
                      key={column.name}
                      style={{ width: `${column.width}px` }}
                      className={clsx(styles.header, {
                        [styles.sortable]: column.sortable,
                        [styles.sorted]: sortField === column.name,
                        [styles.asc]: sortField === column.name && sortOrder === ESortOrder.ASC,
                        [styles.desc]: sortField === column.name && sortOrder === ESortOrder.DESC,
                      })}
                      onClick={() => column.sortable && handleSort(column.name)}
                    >
                      {column.label}
                      {column.sortable && sortField === column.name && (
                        <span className={styles.sortIndicator}>
                          {sortOrder === ESortOrder.ASC ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries[name]?.data?.map((entry: any, index: number) => (
                  <tr
                    key={index}
                    className={clsx(styles.entryListItem, {
                      [styles.selectedRow]: selectedRow === index,
                    })}
                    onClick={() => handleRowClick(index)}
                  >
                    {list_config.columns.map((column: any) => (
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