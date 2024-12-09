
import styles from "./TableRow.module.css";

interface TableRowProps {
  data: {
    id: number;
    quality: string;
    Recqty: number;
    Sno: number;
    shade: string;
    color: string;
    Dygqty: number;
    Balqty: number;
    y_n: string;
    shrinkage: number;
    percentage: number;
    pcs: number;
    issueqty: number;
    Lotno: number;
    barcodeno: number;
    Rack: string;
  };
}

export default function TableRow({ data }: TableRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.cell+' '+styles.cellLeft}>{data.quality}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.Recqty}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.Sno}</div>
      <div className={styles.cell+' '+styles.cellLeft}>{data.shade}</div>
      <div className={styles.cell+' '+styles.cellLeft}>{data.color}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.Dygqty}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.Balqty}</div>
      <div className={styles.cell+' '+styles.cellLeft}>{data.y_n}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.shrinkage}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.percentage}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.pcs}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.issueqty}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.Lotno}</div>
      <div className={styles.cell+' '+styles.cellRight}>{data.barcodeno}</div>
      <div className={styles.cell+' '+styles.cellLeft}>{data.Rack}</div>
    </div>
  );
}
