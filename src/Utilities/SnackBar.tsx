import React from 'react';
import styles from './Snackbar.module.css';

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, isOpen, onClose }) => {
  return isOpen ? (
    <div className={styles.snackbar}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>x</button>
    </div>
  ) : null;
};

export default Snackbar;
