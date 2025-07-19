import React, { memo } from 'react';
// import clsx from 'clsx';
import styles from './Management.module.css';
// import { useAddStore } from '../../useAddStore';
import { Column } from './MangementTypes';
import TableRow from './TableRow';

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
  // Use useMemo to prevent unnecessary recalculation of column widths
  const columnWidths = React.useMemo(() => {
    return columns.map(column => ({ name: column.name, width: '400px' }));
  }, [columns]);

  return (
    <table className={styles.entryTable}>
      <thead>
        <tr>
          {columns?.map((column, index) => (
            <th 
              className={styles.stick} 
              key={column.name} 
              style={{ width: columnWidths[index].width }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowKeys.map((rowId) => (
          <TableRow
            key={rowId}
            rowId={rowId}
            formId={formId}
            columns={columns}
            isSelected={selectedRow === rowId}
            handleRowClick={handleRowClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleInputChange={handleInputChange}
            handledoubleclick={handledoubleclick}
          />
        ))}
      </tbody>
    </table>
  );
};

export default memo(Table);
