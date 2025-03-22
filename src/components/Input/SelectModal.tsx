import styles from "./SelectModal.module.css";

interface ModalProps {
  onClose: () => void;
  title: string;
  fieldname: string;
  data: Array<any>;
  onSelect: (name: string, value: any) => void;
  fields: Array<{ key: string; as: string }>; // Dynamic column mapping
  isMulti: boolean;
}

const Modal = ({ onClose, title, fieldname, data, onSelect, fields, isMulti }: ModalProps) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Select</th>
              {fields.map((field) => (
                <th key={field.as}>{field.as}</th> // Render dynamic columns
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item[fields[0].key]}>
                <td>
                  <input
                    type={isMulti ? "checkbox" : "radio"} // Toggle between radio and checkbox
                    name={isMulti ? `${fieldname}_selection` : "selection"}
                    onChange={() => {
                      onSelect(fieldname, item);
                      if (!isMulti) onClose();
                    }}
                  />
                </td>
                {fields.map((field) => (
                  <td key={field.as}>{item[field.key]}</td> // Render dynamic values
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
