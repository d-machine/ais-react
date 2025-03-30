/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import styles from './EntryList.module.css';
import { ESortOrder } from './types';

interface DataTableProps {
  columns: any[];
  data: any[];
  selectedRow: number;
  onRowClick: (index: number) => void;
  sortField: string;
  sortOrder: ESortOrder;
  onSort: (field: string) => void;
}

export default function DataTable({
    columns,
    data,
    selectedRow,
    onRowClick,
    sortField,
    sortOrder,
    onSort,
  }: DataTableProps) {
    return (
      <table className={styles.entryTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.name}
                style={{ width: `${column.width}px` }}
                className={clsx(styles.header, {
                  [styles.sortable]: column.sortable,
                  [styles.sorted]: sortField === column.name,
                  [styles.asc]: sortField === column.name && sortOrder === ESortOrder.ASC,
                  [styles.desc]: sortField === column.name && sortOrder === ESortOrder.DESC,
                })}
                onClick={() => column.sortable && onSort(column.name)}
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
          {data.map((entry, index) => (
            <tr
              key={index}
              className={clsx(styles.entryListItem, {
                [styles.selectedRow]: selectedRow === index,
              })}
              onClick={() => onRowClick(index)}
            >
              {columns.map((column) => (
                <td key={column.name} className={styles.entryListCell}>
                  {entry[column.name] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }