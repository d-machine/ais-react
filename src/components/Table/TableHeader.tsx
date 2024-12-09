import styles from "./TableHeader.module.css";

export default function TableHeader() {
  return (
    <div className={styles.headerRow}>
      <div className={styles.headerCell}>Quality</div>
      <div className={styles.headerCell}>Rec Qty</div>
      <div className={styles.headerCell}>Sno</div>
      <div className={styles.headerCell}>Shade</div>
      <div className={styles.headerCell}>Color</div>
      <div className={styles.headerCell}>Dygqty</div>
      <div className={styles.headerCell}>Bal Qty</div>
      <div className={styles.headerCell}>Y/N</div>
      <div className={styles.headerCell}>Shrinkage</div>
      <div className={styles.headerCell}>%</div>
      <div className={styles.headerCell}>Pcs</div>
      <div className={styles.headerCell}>Issueqty</div>
      <div className={styles.headerCell}>Lotno</div>
      <div className={styles.headerCell}>Barcodeno</div>
      <div className={styles.headerCell}>Rack</div>
    </div>
  );
}
