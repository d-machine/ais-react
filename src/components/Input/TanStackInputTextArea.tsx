import React from 'react';
import { FieldApi } from '@tanstack/react-form';
import styles from './Input.module.css';
import BaseInput from './BaseInput';

interface TanStackInputTextAreaProps {
  field: any;
  fieldApi: any;
  dependencies?: string[];
  dependencyValues?: Record<string, any>;
}

const TanStackInputTextArea: React.FC<TanStackInputTextAreaProps> = ({
  field,
  fieldApi,
  dependencies = [],
  dependencyValues = {}
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    fieldApi.handleChange(e.target.value);
  };

  // Check if field should be disabled based on dependencies
  const isDependencyDisabled = dependencies.length > 0 && 
    dependencies.some(dep => !dependencyValues[dep]);

  // Determine if component should be disabled
  const isDisabled = field.disabled || isDependencyDisabled || field.read_only;

  return (
    <BaseInput
      label={field.label}
      required={field.required}
      gridColumns={field.grid_columns}
      inputWidth={field.width}
    >
      <textarea
        className={`${styles.input} ${field.read_only ? styles.readOnly : ''}`}
        name={field.name}
        value={fieldApi.state.value || ''}
        onChange={handleInputChange}
        onBlur={fieldApi.handleBlur}
        disabled={isDisabled}
        readOnly={field.read_only}
        placeholder={field.placeholder || ''}
        rows={field.rows || 3}
      />
      {fieldApi.state.meta.errors && fieldApi.state.meta.errors.length > 0 && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {fieldApi.state.meta.errors[0]}
        </div>
      )}
    </BaseInput>
  );
};

export default TanStackInputTextArea;