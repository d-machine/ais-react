import React, { useEffect, useState } from 'react';
import { FieldApi } from '@tanstack/react-form';
import styles from './Input.module.css';
import BaseInput from './BaseInput';
import InputSelectLookup from './InputSelectLookup';
import Modal from '@utils/Modal';
import { DataTableContainer } from '@components/DataTable/DataTableContainer';
import { getConfigApiCall } from '@api/api';
import { postApiCall } from '@api/base';

interface TanStackInputSelectProps {
  field: any;
  fieldApi: any;
  dependencies?: string[];
  dependencyValues?: Record<string, any>;
  configFile?: string;
}

const TanStackInputSelect: React.FC<TanStackInputSelectProps> = ({
  field,
  fieldApi,
  dependencies = [],
  dependencyValues = {},
  configFile = ''
}) => {
  // If field has selectConfig, use the lookup table interface
  if (field.selectConfig) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const [listConfig, setListConfig] = useState<any>(null);
    const [loadingConfig, setLoadingConfig] = useState(false);

    // Get display value from fieldApi state
    useEffect(() => {
      if (field.selectConfig?.currentSelection) {
        // Find the display field
        const displayField = field.selectConfig.currentSelection.find(
          (f: any) => f.key.includes('_name') || f.as.includes('_name')
        );
        if (displayField && fieldApi.form) {
          const fieldValue = fieldApi.form.getFieldValue(displayField.as);
          if (fieldValue) {
            setDisplayValue(fieldValue);
          }
        }
      }
    }, [fieldApi.state.value, field.selectConfig]);

    const fetchLookupConfig = async () => {
      if (!field.selectConfig?.resource) return;
      
      setLoadingConfig(true);
      try {
        const response = await getConfigApiCall(field.selectConfig.resource);
        setListConfig(response.data);
      } catch (error) {
        console.error('Error fetching lookup config:', error);
      } finally {
        setLoadingConfig(false);
      }
    };

    const handleInputClick = () => {
      if (!field.read_only && !field.disabled) {
        fetchLookupConfig();
        setIsModalOpen(true);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !field.read_only && !field.disabled) {
        e.preventDefault();
        fetchLookupConfig();
        setIsModalOpen(true);
      }
    };

    const handleRowSelect = (row: any) => {
      if (!field.selectConfig?.fields_to_extract) return;

      // Extract and set multiple fields
      field.selectConfig.fields_to_extract.forEach((fieldMap: any) => {
        const value = row[fieldMap.key];
        
        // Update the form field using TanStack Form API
        if (fieldApi.form) {
          fieldApi.form.setFieldValue(fieldMap.as, value);
        }
        
        // Update display value if this is the name field
        if (fieldMap.key.includes('_name') || fieldMap.as.includes('_name')) {
          setDisplayValue(value);
        }
      });

      setIsModalOpen(false);
    };

    const handleClear = () => {
      if (!field.read_only && !field.disabled && field.selectConfig?.fields_to_extract) {
        // Clear all extracted fields
        field.selectConfig.fields_to_extract.forEach((fieldMap: any) => {
          if (fieldApi.form) {
            fieldApi.form.setFieldValue(fieldMap.as, '');
          }
        });
        setDisplayValue('');
      }
    };

    return (
      <>
        <BaseInput
          label={field.label}
          required={field.required}
          gridColumns={field.grid_columns}
          inputWidth={field.width}
        >
          <div style={{ position: 'relative', display: 'flex', gap: '4px' }}>
            <input
              type="text"
              className={`${styles.input} ${field.read_only ? styles.readOnly : ''}`}
              value={displayValue}
              onDoubleClick={handleInputClick}
              onKeyDown={handleKeyDown}
              readOnly
              disabled={field.disabled}
              placeholder={`Double-click or press Enter to select ${field.label}`}
              style={{ 
                cursor: field.disabled || field.read_only ? 'not-allowed' : 'pointer',
                flex: 1
              }}
            />
            {displayValue && !field.read_only && !field.disabled && (
              <button
                type="button"
                onClick={handleClear}
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
                  Select {field.label}
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

              {loadingConfig ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  Loading...
                </div>
              ) : listConfig ? (
                <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                  <DataTableContainer
                    configFile={field.selectConfig?.resource || ''}
                    columns={listConfig.columns}
                    name={field.label}
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
  }

  // Original dropdown SELECT implementation
  const [options, setOptions] = useState<Array<{id: any, name: string}>>([]);
  const [loading, setLoading] = useState(false);

  // Fetch options when component mounts or dependencies change
  useEffect(() => {
    if (field.query && field.selectHandler) {
      fetchOptions();
    } else if (field.options) {
      setOptions(field.options);
    }
  }, [field.query, field.selectHandler, dependencyValues]);

  const fetchOptions = async () => {
    if (!field.query || !field.selectHandler) return;
    
    setLoading(true);
    try {
      const response = await postApiCall(
        'api/generic/executeQuery',
        {
          configFile,
          fetchquery: field.query,
          payload: Object.values(dependencyValues),
          path: field.selectHandler
        },
        true
      );
      
      if (response.data) {
        // Transform the data based on field configuration
        const transformedOptions = response.data.map((item: any) => {
          if (field.fields_to_extract) {
            return {
              id: item[field.fields_to_extract.id] || item.id,
              name: item[field.fields_to_extract.name] || item.name || item.label
            };
          }
          return {
            id: item.id || item.value,
            name: item.name || item.label || item.text
          };
        });
        setOptions(transformedOptions);
      }
    } catch (error) {
      console.error('Error fetching select options:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = options.find(opt => String(opt.id) === selectedId);
    
    if (field.multi) {
      // Handle multi-select (would need different implementation)
      fieldApi.handleChange(selectedId);
    } else {
      fieldApi.handleChange(selectedId);
    }
  };

  // Check if field should be disabled based on dependencies
  const isDependencyDisabled = dependencies.length > 0 && 
    dependencies.some(dep => !dependencyValues[dep]);

  // Determine if component should be disabled
  const isDisabled = field.disabled || isDependencyDisabled || field.read_only || loading;

  return (
    <BaseInput
      label={field.label}
      required={field.required}
      gridColumns={field.grid_columns}
      inputWidth={field.width}
    >
      <select
        className={`${styles.input} ${field.read_only ? styles.readOnly : ''}`}
        name={field.name}
        value={fieldApi.state.value || ''}
        onChange={handleSelectChange}
        onBlur={fieldApi.handleBlur}
        disabled={isDisabled}
      >
        <option value="">
          {loading ? 'Loading...' : `Select ${field.label || 'option'}`}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {fieldApi.state.meta.errors && fieldApi.state.meta.errors.length > 0 && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {fieldApi.state.meta.errors[0]}
        </div>
      )}
    </BaseInput>
  );
};

export default TanStackInputSelect;