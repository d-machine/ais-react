import  { useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import ModalForm from "./Modal";
import styles from "./Table.module.css";

export default function Table() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<Array<{ id: number; quality: string;Recqty: number;Sno:number; shade: string; color: string;Dygqty:number;Balqty:number;y_n:string;shrinkage:number;percentage:number;pcs:number;issueqty:number;Lotno:number;barcodeno:number;Rack:string; }>>([]);

  const handleAddRow = (newRow: { id: number; quality: string;Recqty: number;Sno:number; shade: string; color: string;Dygqty:number;Balqty:number;y_n:string;shrinkage:number;percentage:number;pcs:number;issueqty:number;Lotno:number;barcodeno:number;Rack:string; }) => {
    setRows([...rows, newRow]);
  };

  return (
    <div className={styles.tableContainer}>
      <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
        Add Field
      </button>
      <div className={styles.table}>
        <TableHeader />
        <div className={styles.tableBody}>
          {rows.map((row) => (
            <TableRow key={row.id} data={row} />
          ))}
        </div>
      </div>
      {isModalOpen && (
        <ModalForm
          onClose={() => setIsModalOpen(false)}
          onAdd={(newRow) => {
            handleAddRow(newRow);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
