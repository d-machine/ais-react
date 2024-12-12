import  { useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import ModalForm from "./Modal";
import styles from "./Table.module.css";

interface TableConfig {
  section: string;
  width: string;
  fields: {
    name: string;
    type: string;
    label: string;
    minColumnWidth: string;
    width: string;
  }[];
}


const tableConfig: TableConfig = {
  section: "table-grid",
  width: "1200px",
  fields :[
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

const [rows, setRows] = useState<
    { [key: string]: string | number }[]
  >([]);


  const handleAddRow = (newRow: { [key: string]: string | number }) => {
    setRows([...rows, newRow]);
  };

  return (
    <div className={styles.tableContainer}>
      <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
        Add Field
      </button>
      <div className={styles.table}>
        <TableHeader fields={tableConfig.fields} />

        <div className={styles.tableBody}>
          {rows.map((row) => (
            <TableRow key={row.id} data={row} fields={tableConfig.fields} />
          ))}
        </div>
      </div>
      {isModalOpen && (
        <ModalForm

        fields={tableConfig.fields}

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
