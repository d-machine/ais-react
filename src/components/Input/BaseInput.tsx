import React, { ReactNode } from 'react';
import styles from './Input.module.css';

export interface BaseInputProps {
  label: string;
  required?: boolean;
  gridColumns?: number;
  inputWidth?: string;
  children: ReactNode;
}

const BaseInput: React.FC<BaseInputProps> = ({
  label,
  required = false,
  gridColumns = 6,
  inputWidth,
  children
}) => {
  return (
    <div 
      className={styles.inputContainer}
      style={{ gridColumn: `span ${gridColumns}` }}
    >
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div 
        className={styles.inputWrapper}
        style={inputWidth ? { width: inputWidth } : undefined}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseInput;