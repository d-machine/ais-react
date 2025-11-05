import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import styles from './DataTable.module.css';
import clsx from 'clsx';

export interface DataTablePresentationProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  selectedRowIndex?: number;
  onRowClick?: (row: TData, index: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Pure presentational DataTable component - no state, no business logic
 * Just renders the table based on props
 */
export function DataTablePresentation<TData>({
  data,
  columns,
  sorting,
  onSortingChange,
  selectedRowIndex,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
}: DataTablePresentationProps<TData>) {
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // Server-side sorting
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  console.log('here');

  return (
    <div className={styles.dataTableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead className={styles.tableHead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={clsx(styles.tableHeader, {
                      [styles.sortable]: header.column.getCanSort(),
                      [styles.sorted]: header.column.getIsSorted(),
                    })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={styles.headerContent}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className={styles.sortIndicator}>
                          {header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.tableBody}>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={clsx(styles.tableRow, {
                  [styles.selectedRow]: selectedRowIndex === index,
                  [styles.clickable]: !!onRowClick,
                })}
                onClick={() => onRowClick?.(row.original, index)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.tableCell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
