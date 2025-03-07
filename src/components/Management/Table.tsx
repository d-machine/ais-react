import React from 'react';
import clsx from 'clsx';
import styles from './Management.module.css';
import { useAddStore } from '../../useAddStore';
import { Column } from './MangementTypes';

interface RoleTableProps {
  formId: string;
  rowKeys: string[];
  columns: Column[];
  handleRowClick: (rowId: string) => void;
  selectedRow: string | null;
  handleMouseEnter: (columnName: string, event: React.MouseEvent, rowId: string) => void;
  handleMouseLeave: () => void;
  handleInputChange: (rowId: string, columnName: string, value: string | number) => void;
  handledoubleclick: (rowId: string, columnName: string) => void;
}

const Table: React.FC<RoleTableProps> = ({
  formId,
  rowKeys,
  columns,
  handleRowClick,
  selectedRow,
  handleMouseEnter,
  handleMouseLeave,
  handleInputChange,
  handledoubleclick,
}) => {
  return (
    <table className={styles.entryTable}>
      <thead>
        <tr>
          {columns?.map((column) => (
            <th className={styles.stick} key={column.name} style={{ width: `400px` }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowKeys.map((rowId) => {
          const entry = useAddStore.getState().entries[formId].rows[rowId].updatedData;
          return (
            <tr
              key={rowId}
              className={clsx(`${rowId}`, styles.entryListItem, {
                [styles.selectedRow]: selectedRow === rowId,
              })}
              onClick={() => handleRowClick(rowId)}
            >
              {columns?.map((column) => (
                <td
                  key={column.name}
                  data-column={column.name}
                  className={styles.entryListCell}
                  onMouseEnter={(e) => handleMouseEnter(column.name, e, rowId)}
                  onMouseLeave={handleMouseLeave}
                >
                  {column.type === 'TEXT' ? (
                    <input
                      style={{ width: '100%' }}
                      type='text'
                      value={entry[column.name] || ''}
                      onChange={(e) => {
                        const td = e.target.closest('td');
                        if (td) td.classList.add(styles.change);
                        handleInputChange(rowId, column.name, e.target.value);
                      }}
                    />
                  ) : column.type === 'SELECT' ? (
                    <input
                      readOnly
                      onDoubleClick={() => handledoubleclick(rowId, column.name)}
                      style={{ width: '100%' }}
                      type='text'
                      value={entry[column.name] || ''}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
