import React from 'react';
import styles from './Management.module.css';
import { Section } from './MangementTypes';

interface RoleModalProps {
  modalData: string[];
  columnName: string | null;
  userConfig: Section;
  handleModalClick: (name: string, isChecked: boolean) => void;
  handleModalClose: () => void;
}

const Modal: React.FC<RoleModalProps> = ({
  modalData,
  columnName,
  userConfig,
  handleModalClick,
  handleModalClose,
}) => {
  const column = userConfig.columns?.find((col) => col.name === columnName);
  const isMulti = column?.multi ?? true;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    handleModalClick(value, checked);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <h3>{column?.label} Options</h3>
          <button className={styles.close_button} onClick={handleModalClose}>
            X
          </button>
        </div>
        <div className={styles.modal_body}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th style={{ width: '100px' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {column?.selectConfig?.options?.map((option) => (
                <tr key={option.id} style={{ padding: '10px' }}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type={isMulti ? 'checkbox' : 'radio'}
                      name={isMulti ? `checkbox-${columnName}` : `radio-${columnName}`} 
                      value={option.name}
                      checked={modalData.includes(option.name)}
                      onChange={handleChange}
                      style={{ margin: '0' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>
                    {option.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal;