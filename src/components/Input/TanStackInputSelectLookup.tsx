import React, { useState, useEffect } from 'react';
import Modal from '@components/Modal/Modal';
import DataTableContainer from '@components/DataTable/DataTableContainer';
import { getConfigApiCall } from '@api/api';
import styles from './Input.module.css';

interface TanStackInputSelectLookupProps {
  field: any;
  fieldApi: any;
}

const TanStackInputSelectLookup: React.FC<TanStackInputSelectLookupProps> = ({ field, fieldApi }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [listConfig, setListConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Update display value when form value changes
  useEffect(() => {
    if (field.selectConfig?.currentSelection) {
      const displayField = field.selectConfig.currentSelection.find(
        (f: any) => f.key.includes('_name') || f.as.includes('_name')
      );
      if (displayField) {
        const fieldValue = fieldApi.form.getFieldValue(displayField.as);
        setDisplayValue(fieldValue || '');
      }
    }
  }, [fieldApi.state.value, field.selectConfig]);

  const fetchLookupConfig = async () => {
    if (!field.selectConfig?.resource) return;
    
    setLoadingConfig(true);
    try {
      const config = await getConfigApiCall(field.selectConfig.resource);
      setListConfig(config);
    } catch (error) {
      console.error('Failed to fetch lookup config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleInputInteraction = async () => {
    if (!listConfig) {
      await fetchLookupConfig();
    }
    setIsModalOpen(true);
  };

  const handleRowSelect = (row: any) => {
    // Extract and set all configured fields
    if (field.selectConfig?.fields_to_extract) {
      field.selectConfig.fields_to_extract.forEach((fieldMap: any) => {
        const value = row[fieldMap.key];
        fieldApi.form.setFieldValue(fieldMap.as, value);
      });
    }
    setIsModalOpen(false);
  };

  const handleClear = () => {
    // Clear all extracted fields
    if (field.selectConfig?.fields_to_extract) {
      field.selectConfig.fields_to_extract.forEach((fieldMap: any) => {
        fieldApi.form.setFieldValue(fieldMap.as, '');
      });
    }
    setDisplayValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputInteraction();
    }
  };

  return (
    <div className={styles['input-wrapper']}>
      <label htmlFor={field.name} className={styles.label}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>
      
      <div className={styles['lookup-input-container']}>
        <input
          type="text"
          id={field.name}
          value={displayValue}
          onDoubleClick={handleInputInteraction}
          onKeyDown={handleKeyDown}
          readOnly
          placeholder={field.placeholder || 'Double-click or press Enter to select'}
          className={`${styles.input} ${styles['lookup-input']}`}
        />
        
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles['clear-button']}
            aria-label="Clear selection"
          >
            ✕
          </button>
        )}
      </div>

      {fieldApi.state.meta.errors.length > 0 && (
        <span className={styles.error}>{fieldApi.state.meta.errors[0]}</span>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Select ${field.label}`}
        >
          {loadingConfig ? (
            <div>Loading...</div>
          ) : listConfig ? (
            <DataTableContainer
              config={listConfig}
              onRowClick={handleRowSelect}
            />
          ) : (
            <div>Failed to load options</div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default TanStackInputSelectLookup;
