import React from 'react';
import styles from './Management.module.css';
import { Section } from './MangementTypes';

interface RoleModalProps {
  modalData: string[];
  columnName: string | null;
  userConfig: Section;
  handleModalClick: (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>, name: string) => void;
  handleModalClose: () => void;
}

const Modal: React.FC<RoleModalProps> = ({
  modalData,
  columnName,
  userConfig,
  handleModalClick,
  handleModalClose,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <button className={styles.close_button} onClick={handleModalClose}>
            X
          </button>
        </div>
        <div className={styles.modal_body}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {userConfig.columns
                ?.filter((column) => column.name === columnName)
                .map((column) =>
                  column.selectConfig?.options?.map((option) => (
                    <tr key={option.id} style={{ cursor: 'pointer', padding: '10px' }}>
                      <td
                        style={{
                          textAlign: 'center',
                          backgroundColor: modalData.includes(option.name) ? 'red' : 'white',
                        }}
                        onClick={(event) => handleModalClick(event, option.name)}
                      >
                        {option.name}
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal;
