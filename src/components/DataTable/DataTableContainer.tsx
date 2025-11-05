import { useEffect, useState, useMemo } from 'react';
import { SortingState } from '@tanstack/react-table';
import { DataTablePresentation } from './DataTablePresentation';
import { createTableColumns, convertToApiSorting } from './columnUtils';
import { postApiCall } from '@api/base';
import { Column } from '../EntryList/types';

export interface IFilterInfo {
  field: string;
  value: string;
  operator?: string;
}

export interface ISortInfo {
  field: string;
  order: 'asc' | 'desc';
}

export interface IFetchQuery {
  sortData?: ISortInfo[];
  filtersData?: IFilterInfo[];
}

export interface DataTableContainerProps {
  configFile: string;
  columns: Column[];
  name: string;
  onRowSelect?: (row: any, index: number) => void;
  selectedRowIndex?: number;
  activeFilters?: IFilterInfo[];
}

/**
 * Smart container component - handles all business logic and API calls
 * Use this everywhere in your application
 */
export function DataTableContainer({
  configFile,
  columns,
  name,
  onRowSelect,
  selectedRowIndex,
  activeFilters = [],
}: DataTableContainerProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Create TanStack Table columns from your config
  const tableColumns = useMemo(() => {
    return createTableColumns(columns, {
      enableSorting: true,
      enableFiltering: false,
    });
  }, [columns]);

  // Fetch data from backend
  const fetchData = async (fetchQuery?: IFetchQuery) => {
    try {
      setIsLoading(true);
      const response = await postApiCall('/api/generic/executeQuery', {
        configFile,
        fetchQuery,
      }, true);
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting change - convert and call API
  const handleSortingChange = (newSorting: SortingState | ((old: SortingState) => SortingState)) => {
    const updatedSorting = typeof newSorting === 'function' ? newSorting(sorting) : newSorting;
    setSorting(updatedSorting);

    const fetchQuery: IFetchQuery = {};
    
    if (updatedSorting.length > 0) {
      fetchQuery.sortData = convertToApiSorting(updatedSorting);
    }
    
    if (activeFilters.length > 0) {
      fetchQuery.filtersData = activeFilters;
    }

    fetchData(Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchQuery: IFetchQuery = {};
    if (activeFilters.length > 0) {
      fetchQuery.filtersData = activeFilters;
    }
    fetchData(Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
  }, [configFile, name]);

  // Refetch when filters change
  useEffect(() => {
    const fetchQuery: IFetchQuery = {};
    if (sorting.length > 0) {
      fetchQuery.sortData = convertToApiSorting(sorting);
    }
    if (activeFilters.length > 0) {
      fetchQuery.filtersData = activeFilters;
    }
    fetchData(Object.keys(fetchQuery).length > 0 ? fetchQuery : undefined);
  }, [activeFilters]);

  return (
    <DataTablePresentation
      data={data}
      columns={tableColumns}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      selectedRowIndex={selectedRowIndex}
      onRowClick={onRowSelect}
      isLoading={isLoading}
      emptyMessage="No data available"
    />
  );
}
