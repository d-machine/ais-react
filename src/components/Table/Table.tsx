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

interface TableConfig {
  section: string;
  width: string;
  fields: Field[];
}

const TABLE_CONFIG: TableConfig = {
  section: "table-grid",
  width: "1200px",
  fields: [
    { name: "quality", type: "text", label: "Quality", minColumnWidth: "100px", width: "200px" },
    { name: "Recqty", type: "number", label: "Rec Qty", minColumnWidth: "100px", width: "150px" },
    { name: "Sno", type: "number", label: "S No", minColumnWidth: "100px", width: "100px" },
    { name: "shade", type: "text", label: "Shade", minColumnWidth: "100px", width: "150px" },
    { name: "color", type: "text", label: "Color", minColumnWidth: "100px", width: "150px" },
    { name: "Dygqty", type: "number", label: "Dyg Qty", minColumnWidth: "100px", width: "150px" },
    { name: "Balqty", type: "number", label: "Bal Qty", minColumnWidth: "100px", width: "150px" },
    { name: "y_n", type: "text", label: "Y/N", minColumnWidth: "100px", width: "100px" },
    { name: "shrinkage", type: "number", label: "Shrinkage", minColumnWidth: "100px", width: "150px" },
    { name: "percentage", type: "number", label: "Percentage", minColumnWidth: "100px", width: "150px" },
    { name: "pcs", type: "number", label: "Pcs", minColumnWidth: "100px", width: "150px" },
    { name: "issueqty", type: "number", label: "Issue Qty", minColumnWidth: "100px", width: "150px" },
    { name: "Lotno", type: "number", label: "Lot No", minColumnWidth: "100px", width: "150px" },
    { name: "barcodeno", type: "number", label: "Barcode No", minColumnWidth: "100px", width: "150px" },
    { name: "Rack", type: "text", label: "Rack", minColumnWidth: "100px", width: "150px" }
  ]
};
export default function Table() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<{ [key: string]: string | number }[]>([]);

  const handleAddRow =(newRow: { [key: string]: string | number }) => {
    setRows(prevRows => [...prevRows, { ...newRow, id: Date.now() }]);
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
        {TABLE_CONFIG.fields.map((field) => (
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
        {TABLE_CONFIG.fields.map((field) => (
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
            fields={TABLE_CONFIG.fields}
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