import { useState } from "react";
import clsx from 'clsx';
import styles from "./Table.module.css";
import ModalForm from "./Modal";

// Type Definitions
interface Field {
  name: string;
  type: string;
  label: string;
  minColumnWidth: string;
  width: string;
}


interface TableProps {
  fields: Field[]
  rows:{[key:string]:string | number}[];
  setRows: (row: { [key: string]: string | number }) => void
}
export default function Table({fields,rows,setRows}:TableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRow =(newRow: { [key: string]: string | number }) => {
    setRows(newRow);
  };

  return (
    <div className={styles.tableWrapper}>
      <button 
        className={styles.addButton} 
        onClick={() => setIsModalOpen(true)}
      >
        Add Field
      </button>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
        <thead>
      <tr className={styles.headerRow}>
        {fields.map((field) => (
          <th 
            key={field.name} 
            className={styles.headerCell} 
            style={{ minWidth: field.minColumnWidth }}
          >
            {field.label}
          </th>
        ))}
      </tr>
    </thead>
          <tbody>
            {    rows.map((row) => (
      <tr key={row.id} className={styles.row}>
        {fields.map((field) => (
          <td 
            key={field.name} 
            className={clsx(
              styles.cell, 
              field.type === 'number' ? styles.cellRight : styles.cellLeft
            )}
          >
            {row[field.name]}
          </td>
        ))}
      </tr>
    ))}
          </tbody>
        </table>
        
        {isModalOpen && (
          <ModalForm
            fields={fields}
            onClose={() => setIsModalOpen(false)}
            onAdd={(newRow) => {
              handleAddRow(newRow);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}