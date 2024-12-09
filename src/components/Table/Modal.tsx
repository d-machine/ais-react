import { useState } from "react";
import styles from "./ModalForm.module.css";

interface ModalFormProps {
  onClose: () => void;
  onAdd: (row: {
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
  }) => void;
}

export default function ModalForm({ onClose, onAdd }: ModalFormProps) {
  const [quality, setQuality] = useState("");
  const [Recqty, setRecqty] = useState(0);
  const [Sno, setSno] = useState(0);
  const [shade, setShade] = useState("");
  const [color, setColor] = useState("");
  const [Dygqty, setDygqty] = useState(0);
  const [Balqty, setBalqty] = useState(0);
  const [y_n, setYn] = useState("");
  const [shrinkage, setShrinkage] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [pcs, setPcs] = useState(0);
  const [issueqty, setIssueqty] = useState(0);
  const [Lotno, setLotno] = useState(0);
  const [barcodeno, setBarcodeno] = useState(0);
  const [Rack, setRack] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (y_n !== "Y" && y_n !== "N") {
      setErrorMessage("Y/N must be 'Y' or 'N'.");
      return;
    }
    if (percentage > 100) {
      setErrorMessage("Percentage cannot exceed 100.");
      return;
    }
    const newRow = {
      id: Date.now(),
      quality,
      Recqty,
      Sno,
      shade,
      color,
      Dygqty,
      Balqty,
      y_n,
      shrinkage,
      percentage,
      pcs,
      issueqty,
      Lotno,
      barcodeno,
      Rack,
    };

    onAdd(newRow);
    setErrorMessage(""); 
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Add New Entry</h2>
        
        <form>
          <label>
            Quality:
            <input
              type="text"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
          </label>
          <label>
            Recqty:
            <input
              type="number"
              value={Recqty}
              onChange={(e) => setRecqty(Number(e.target.value))}
            />
          </label>
          <label>
            Sno:
            <input
              type="number"
              value={Sno}
              onChange={(e) => setSno(Number(e.target.value))}
            />
          </label>
          <label>
            Shade:
            <input
              type="text"
              value={shade}
              onChange={(e) => setShade(e.target.value)}
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <label>
            Dygqty:
            <input
              type="number"
              value={Dygqty}
              onChange={(e) => setDygqty(Number(e.target.value))}
            />
          </label>
          <label>
            Balqty:
            <input
              type="number"
              value={Balqty}
              onChange={(e) => setBalqty(Number(e.target.value))}
            />
          </label>
          <label>
            Y/N:
            <input
              type="text"
              value={y_n}
              onChange={(e) =>
                setYn(e.target.value.toUpperCase().slice(0, 1)) 
              }
            />
          </label>
          <label>
            Shrinkage:
            <input
              type="number"
              value={shrinkage}
              onChange={(e) => setShrinkage(Number(e.target.value))}
            />
          </label>
          <label>
            Percentage:
            <input
              type="number"
              value={percentage}
              onChange={(e) =>
                setPercentage(Math.min(Number(e.target.value), 100)) 
              }
            />
          </label>
          <label>
            Pcs:
            <input
              type="number"
              value={pcs}
              onChange={(e) => setPcs(Number(e.target.value))}
            />
          </label>
          <label>
            Issueqty:
            <input
              type="number"
              value={issueqty}
              onChange={(e) => setIssueqty(Number(e.target.value))}
            />
          </label>
          <label>
            Lotno:
            <input
              type="number"
              value={Lotno}
              onChange={(e) => setLotno(Number(e.target.value))}
            />
          </label>
          <label>
            Barcodeno:
            <input
              type="number"
              value={barcodeno}
              onChange={(e) => setBarcodeno(Number(e.target.value))}
            />
          </label>
          <label>
            Rack:
            <input
              type="text"
              value={Rack}
              onChange={(e) => setRack(e.target.value)}
            />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={handleSubmit}>
              Add
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
}
