import styles from './SelectModal.module.css';

interface ModalProps {
  onClose: () => void;
  title: string;
  fieldname: string;
  data: Array<{ id: string | number; name: string }>;
  onSelect: (name: string, value: { id: string | number; name: string }) => void;
}

const Modal = ({  onClose, title,fieldname, data, onSelect }:ModalProps) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="radio"
                    name="selection"
                    onChange={() => {onSelect(fieldname, item) ; onClose();}}
                  />
                </td>
                <td>{item.name}</td>
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
