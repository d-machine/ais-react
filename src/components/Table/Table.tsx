import { useState } from "react";
import clsx from 'clsx';
import styles from "./Table.module.css";
import ModalForm from "./Modal";
import { EGridTye } from "../Input/types";

// Type Definitions
interface Field {
  name: string;
  type:EGridTye;
  label: string;    
  required: boolean;
  readOnly: boolean;
  columnWidth: number;
}


interface TableProps {
  id:string,
  fields: Field[]
  rows:{[key:string]:string | number}[];
  setRows: (id: string, row: { [key: string]: string | number }) => void
}
export default function Table({id,fields,rows,setRows}:TableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRow =( newRow: { [key: string]: string | number }) => {
    setRows(id,newRow);
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
            style={{ minWidth: field.columnWidth }}
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