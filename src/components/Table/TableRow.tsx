
import styles from "./TableRow.module.css";

import clsx from 'clsx';

interface TableRowProps {
  data: { [key: string]: string | number };
  fields: {
    name: string;
    type: string | number;
    minColumnWidth: string;
    width: string;
  }[];
}

export default function TableRow({ data,fields }: TableRowProps) {
  return (
    <div className={styles.row}>
      {
        fields.map((field, index) => (
          <div
            key={index}
            className={clsx(styles.cell,field.type === 'number' ? styles.cellRight : styles.cellLeft)}
          >
            {data[field.name]}
          </div>
        ))
      }
    </div>
  );
}
