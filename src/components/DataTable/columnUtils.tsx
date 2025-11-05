import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Column } from '../EntryList/types';

export interface DataTableColumn extends Column {
  // Extend your existing column type if needed
}

export interface ColumnConfig {
  columns: DataTableColumn[];
}

/**
 * Creates TanStack Table column definitions from your existing column configuration
 */
export function createTableColumns<TData = any>(
  columns: DataTableColumn[],
  options: {
    enableSorting?: boolean;
    enableFiltering?: boolean;
    onCellClick?: (row: TData, column: string, value: any) => void;
    cellRenderer?: (column: string, value: any, row: TData) => React.ReactNode;
  } = {}
): ColumnDef<TData>[] {
  const columnHelper = createColumnHelper<TData>();

  return columns.map((col) => {
    return columnHelper.accessor(col.name as keyof TData, {
      id: col.name,
      header: col.label,
      enableSorting: options.enableSorting && col.sortable,
      enableColumnFilter: options.enableFiltering && col.filterType !== 'none',
      size: col.width,
      minSize: Math.min(col.width, 100),
      maxSize: Math.max(col.width, 500),
      cell: ({ getValue, row, column }) => {
        const value = getValue();
        const cellContent = options.cellRenderer 
          ? options.cellRenderer(col.name, value, row.original)
          : (value || '');

        return (
          <div
            className="table-cell"
            onClick={() => options.onCellClick?.(row.original, col.name, value)}
            style={{ 
              cursor: options.onCellClick ? 'pointer' : 'default',
              padding: '8px 12px',
              textAlign: col.name.includes('amount') || col.name.includes('price') ? 'right' : 'left'
            }}
          >
            {cellContent}
          </div>
        );
      },
      filterFn: getFilterFunction(col.filterType || ''),
    });
  });
}

/**
 * Maps your existing filter types to TanStack Table filter functions
 */
function getFilterFunction(filterType: string) {
  switch (filterType.toLowerCase()) {
    case 'text':
    case 'string':
      return 'includesString';
    case 'number':
    case 'numeric':
      return 'inNumberRange';
    case 'date':
      return 'inDateRange';
    case 'boolean':
      return 'equals';
    default:
      return 'includesString';
  }
}

/**
 * Converts your existing sort/filter query to TanStack Table format
 */
export function convertSortingState(sortData?: { field: string; order: 'asc' | 'desc' }[]) {
  if (!sortData || sortData.length === 0) return [];
  
  return sortData.map(sort => ({
    id: sort.field,
    desc: sort.order === 'desc'
  }));
}

/**
 * Converts TanStack Table sorting state back to your API format
 */
export function convertToApiSorting(sorting: { id: string; desc: boolean }[]) {
  return sorting.map(sort => ({
    field: sort.id,
    order: sort.desc ? 'desc' as const : 'asc' as const
  }));
}

