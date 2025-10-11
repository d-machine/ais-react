import React, { useState } from 'react';
import styles from './SelectModal.module.css';

interface ModalProps {
  onClose: () => void;
  title: string;
  fieldname: string;
  data: Array<any>;
  onSelect: (name: string, value: any) => void;
  fields: Array<{ key: string; as: string }>;
  isMulti: boolean;
}

const SelectModal = ({ onClose, title, fieldname, data, onSelect, fields, isMulti }: ModalProps) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  
  const handleSelect = (item: any) => {
    if (isMulti) {
      const key = item[fields[0].key];
      setSelectedItems(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    } else {
      onSelect(fieldname, item);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (isMulti) {
      const selectedData = data.filter(item => 
        selectedItems[item[fields[0].key]]
      );
      onSelect(fieldname, selectedData);
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeIcon} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.selectColumn}>Select</th>
                {fields.map((field) => (
                  <th key={field.as}>{field.as}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const itemKey = item[fields[0].key];
                return (
                  <tr 
                    key={itemKey} 
                    className={selectedItems[itemKey] ? styles.selectedRow : ''}
                    onClick={() => handleSelect(item)}
                  >
                    <td className={styles.selectColumn}>
                      <input
                        type={isMulti ? "checkbox" : "radio"}
                        name={isMulti ? `${fieldname}_${itemKey}` : fieldname}
                        checked={isMulti ? !!selectedItems[itemKey] : false}
                        onChange={() => {}} // Handled by row click
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    {fields.map((field) => (
                      <td key={`${itemKey}-${field.as}`}>{item[field.key]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className={styles.modalFooter}>
          {isMulti && (
            <button 
              onClick={handleConfirm} 
              className={styles.confirmButton}
              disabled={Object.values(selectedItems).filter(Boolean).length === 0}
            >
              Confirm Selection
            </button>
          )}
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
