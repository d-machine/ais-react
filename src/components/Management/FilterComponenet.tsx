/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './EntryList.module.css';
import clsx from 'clsx';
import { EFilterOperator, IFilterInfo } from './types';

interface FilterComponentProps {
  columns: any[];
  filterColumn: string;
  filterValue: string;
  filterOperator: EFilterOperator;
  onFilterColumnChange: (value: string) => void;
  onFilterValueChange: (value: string) => void;
  onFilterOperatorChange: (value: EFilterOperator) => void;
  onApplyFilter: (filter: IFilterInfo) => void;
  onClearFilter: () => void;
  onClearSort: () => void;
  hasSort: boolean;
}

function FilterComponent({
  columns,
  filterColumn,
  filterValue,
  filterOperator,
  onFilterColumnChange,
  onFilterValueChange,
  onFilterOperatorChange,
  onApplyFilter,
  onClearFilter,
  onClearSort,
  hasSort,
}: FilterComponentProps) {
  const handleApply = () => {
    if (filterColumn && filterValue) {
      const newFilter = { field: filterColumn, value: filterValue, operator: filterOperator };
      onApplyFilter(newFilter);
    }
  };

  return (
    <div className={styles.filterCard}>
      <div className={styles.filterRow}>
        <select
          value={filterColumn}
          onChange={(e) => onFilterColumnChange(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Column</option>
          {columns.map((col) => (
            <option key={col.name} value={col.name}>
              {col.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          placeholder="Enter filter value"
          className={styles.input}
        />
        <select
          value={filterOperator}
          onChange={(e) => onFilterOperatorChange(e.target.value as EFilterOperator)}
          className={styles.select}
        >
          {Object.values(EFilterOperator).map((op) => (
            <option key={op} value={op}>
              {op.replace(/_/g, ' ').toLowerCase()}
            </option>
          ))}
        </select>
        <button onClick={handleApply} className={styles.actionButton}>
          Apply Filter
        </button>
        <button
          onClick={onClearFilter}
          className={clsx(styles.actionButton, styles.disabledButton)}
        >
          Clear Filter
        </button>
        {hasSort && (
          <button onClick={onClearSort} className={styles.actionButton}>
            Clear Sort
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterComponent;