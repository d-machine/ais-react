import { useState } from "react";
import styles from "./ModalForm.module.css";

interface ModalFormProps {   fields: {
  name: string;
  type: string | number;
  label: string;
  minColumnWidth: string;
  width: string;
}[];
  onClose: () => void; 
  onAdd: (row: { [key: string]: string | number }) => void; }

export default function ModalForm({fields, onClose, onAdd }: ModalFormProps) {
  const [formValues, setFormValues] = useState<{ [key: string]: string | number }>({});

 // const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {

    const newRow = {
      id: Date.now(),...formValues};

    onAdd(newRow);
    //setErrorMessage(""); 
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Add New Entry</h2>
        
        <form>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}
              <input
                type={field.type==='number' ? 'number' : 'text'}
                value={formValues[field.name] || ""}
                onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}/>
              </label>
          ))}
          <div className={styles.actions}>
            <button type="button" onClick={handleSubmit}>
              Add
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        {/*errorMessage && <p className={styles.error}>{errorMessage}</p>*/}
      </div>
    </div>
  );
}
