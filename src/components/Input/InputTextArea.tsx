import React from 'react';
import styles from './Input.module.css';
import BaseInput from './BaseInput';

export interface InputTextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  read_only?: boolean;
  disabled?: boolean;
  grid_columns?: number;
  input_width?: string;
  dependencies?: string[];
  formData: Record<string, any>;
  setFormData: (name: string, value: any) => void;
  dependencyValues?: Record<string, any>;
  id?: string;
  field?: any;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({
  name,
  label,
  required = false,
  read_only = false,
  disabled = false,
  grid_columns,
  input_width,
  dependencies = [],
  formData,
  setFormData,
  dependencyValues = {},
  id,
  field
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(name, e.target.value);
  };

  // Support both new and old API
  const actualName = name || (field && field.name);
  const actualLabel = label || (field && field.label);
  const actualRequired = required || (field && field.required) || false;
  
  // Check if field should be disabled based on dependencies
  const isDependencyDisabled = dependencies.length > 0 && 
    dependencies.some(dep => !dependencyValues[dep]);

  // Determine if component should be disabled
  const isDisabled = disabled || isDependencyDisabled || read_only;

  return (
    <BaseInput
      label={actualLabel}
      required={actualRequired}
      gridColumns={grid_columns}
      inputWidth={input_width}
    >
      <textarea
        className={`${styles.textarea} ${read_only ? styles.readOnly : ''}`}
        name={actualName}
        defaultValue={formData[actualName] || ''}
        onChange={handleInputChange}
        disabled={isDisabled}
        readOnly={read_only}
      />
    </BaseInput>
  );
};

export default InputTextArea;