import React, { memo  } from 'react';
import clsx from 'clsx';
import styles from './Management.module.css';
import { useAddStore } from '../../useAddStore';
import { Column } from './MangementTypes';

interface TableRowProps {
  rowId: string;
  formId: string | number;
  columns: Column[];
  isSelected: boolean;
  handleRowClick: (rowId: string) => void;
  handleMouseEnter: (columnName: string, event: React.MouseEvent, rowId: string) => void;
  handleMouseLeave: () => void;
  handleInputChange: (rowId: string, columnName: string, value: string | number) => void;
  handledoubleclick: (rowId: string, columnName: string) => void;
}

// Create a memoized table row component with local state for display values
const TableRow: React.FC<TableRowProps> = memo(({ 
  rowId, 
  formId, 
  columns, 
  isSelected, 
  handleRowClick, 
  handleMouseEnter, 
  handleMouseLeave, 
  handleInputChange, 
  handledoubleclick 
}) => {
  // Use the store directly with a subscription to ensure updates
  const rowData = useAddStore(state => state.entries[formId]?.rows[rowId]);
  
  if (!rowData) return null;

  return (
    <tr
      className={clsx(`${rowId}`, styles.entryListItem, {
        [styles.selectedRow]: isSelected,
      })}
      onClick={() => handleRowClick(rowId)}
    >
      {columns?.map((column) => {
        // Get value from updatedData or fallback to originalData
        let displayValue = rowData.updatedData[column.name] ?? rowData.originalData[column.name] ?? '';

        if (column.type === 'SELECT' && column.selectConfig?.currentSelection?.[0]?.key) {
          displayValue = rowData.updatedData[column.selectConfig.currentSelection[0].key] ?? displayValue;
        }
        
        return (
          <td
            key={column.name}
            data-column={column.name}
            className={styles.entryListCell}
            onMouseEnter={(e) => handleMouseEnter(column.name, e, rowId)}
            onMouseLeave={handleMouseLeave}
          >
            {column.type === 'TEXT' || column.type === 'SELECT' ? (
              <input
                style={{ width: '100%' }}
                type="text"
                value={displayValue}
                onChange={(e) => {
                  const td = e.target.closest('td');
                  td?.classList.add(styles.change);
                  handleInputChange(rowId, column.name, e.target.value);
                }}
                onDoubleClick={() => column.type === 'SELECT' && handledoubleclick(rowId, column.name)}
              />
            ) : null}
          </td>
        );
      })}
    </tr>
  );
});

export default TableRow;