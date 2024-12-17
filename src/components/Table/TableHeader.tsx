import styles from "./TableHeader.module.css";

interface TableHeaderProps {
  fields: {
    name: string;
    label: string;
    minColumnWidth: string;
    width: string;
  }[];
}
export default function TableHeader({fields}: TableHeaderProps) {
  return (
    <div className={styles.headerRow}>

      {
        fields.map((field) => (
          <div className={styles.headerCell}>{field.label}</div>
        ))
      }
    </div>
  );
}
