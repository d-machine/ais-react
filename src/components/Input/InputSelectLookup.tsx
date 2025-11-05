import React, { useState, useEffect } from 'react';
import styles from './Input.module.css';
import BaseInput from './BaseInput';
import Modal from '@utils/Modal';
import { DataTableContainer } from '@components/DataTable/DataTableContainer';
import { getConfigApiCall } from '@api/api';

interface InputSelectLookupProps {
  name: string;
  label: string;
  required?: boolean;
  read_only?: boolean;
  disabled?: boolean;
  grid_columns?: number;
  input_width?: number;
  formData: Record<string, any>;
  setFormData: (name: string, value: any) => void;
  selectConfig?: {
    resource: string;
    selectHandler: string;
    currentSelection: Array<{ key: string; as: string }>;
    selectParser: string;
    fields_to_extract: Array<{ key: string; as: string }>;
  };
}

const InputSelectLookup: React.FC<InputSelectLookupProps> = ({
  name,
  label,
  required = false,
  read_only = false,
  disabled = false,
  grid_columns,
  input_width,
  formData,
  setFormData,
  selectConfig,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [listConfig, setListConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get display value from formData
  useEffect(() => {
    if (selectConfig?.currentSelection) {
      // Find the display field (usually ends with '_name')
      const displayField = selectConfig.currentSelection.find(
        field => field.key.includes('_name') || field.as.includes('_name')
      );
      if (displayField && formData[displayField.as]) {
        setDisplayValue(formData[displayField.as]);
      }
    }
  }, [formData, selectConfig]);

  // Fetch config for the lookup table when modal opens
  const fetchLookupConfig = async () => {
    if (!selectConfig?.resource) return;
    
    setLoading(true);
    try {
      const response = await getConfigApiCall(selectConfig.resource);
      setListConfig(response.data);
    } catch (error) {
      console.error('Error fetching lookup config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputClick = () => {
    if (!read_only && !disabled) {
      fetchLookupConfig();
      setIsModalOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !read_only && !disabled) {
      e.preventDefault();
      fetchLookupConfig();
      setIsModalOpen(true);
    }
  };

  const handleRowSelect = (row: any) => {
    if (!selectConfig?.fields_to_extract) return;

    // Extract and set multiple fields based on configuration
    selectConfig.fields_to_extract.forEach((fieldMap) => {
      const value = row[fieldMap.key];
      setFormData(fieldMap.as, value);
      
      // Update display value if this is the name field
      if (fieldMap.key.includes('_name') || fieldMap.as.includes('_name')) {
        setDisplayValue(value);
      }
    });

    setIsModalOpen(false);
  };

  const handleClear = () => {
    if (!read_only && !disabled && selectConfig?.fields_to_extract) {
      // Clear all extracted fields
      selectConfig.fields_to_extract.forEach((fieldMap) => {
        setFormData(fieldMap.as, '');
      });
      setDisplayValue('');
    }
  };

  return (
    <>
      <BaseInput
        label={label}
        required={required}
        gridColumns={grid_columns}
        inputWidth={input_width}
      >
        <div style={{ position: 'relative', display: 'flex', gap: '4px' }}>
          <input
            type="text"
            className={`${styles.input} ${read_only ? styles.readOnly : ''}`}
            name={name}
            value={displayValue}
            onDoubleClick={handleInputClick}
            onKeyDown={handleKeyDown}
            readOnly
            disabled={disabled}
            placeholder={`Double-click or press Enter to select ${label}`}
            style={{ 
              cursor: disabled || read_only ? 'not-allowed' : 'pointer',
              flex: 1
            }}
          />
          {displayValue && !read_only && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              style={{
                padding: '4px 8px',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </BaseInput>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div style={{ padding: '20px', minWidth: '600px', maxWidth: '90vw' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #e0e0e0',
              paddingBottom: '10px'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                Select {label}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '4px 12px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading...
              </div>
            ) : listConfig ? (
              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                <DataTableContainer
                  configFile={selectConfig?.resource || ''}
                  columns={listConfig.columns}
                  name={label}
                  onRowSelect={(row) => handleRowSelect(row)}
                  selectedRowIndex={-1}
                  activeFilters={[]}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                No configuration available
              </div>
            )}

            <div style={{ 
              marginTop: '20px', 
              paddingTop: '10px',
              borderTop: '1px solid #e0e0e0',
              textAlign: 'right'
            }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default InputSelectLookup;
