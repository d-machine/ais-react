import React, { useState, useEffect } from 'react';
import styles from './Input.module.css';
import BaseInput from './BaseInput';
import SelectModal from './SelectModal';
import { postApiCall } from '../../api/base';
import { executeQueryApiCall } from '../../api/api';

interface InputSelectProps {
  name: string;
  label: string;
  required?: boolean;
  read_only?: boolean;
  disabled?: boolean;
  grid_columns?: number;
  input_width?: string;
  dependencies?: string[];
  multi?: boolean;
  selectHandler?: string;
  selectParser?: string;
  currentSelection?: any;
  fields_to_extract?: string[];
  // Case 1: Options array and columnConfig
  options?: { value: string; label: string }[];
  columnConfig?: { key: string; as: string }[];
  // Case 2: QueryInfo and columnConfig
  queryInfo?: {
    path: string[];
    payload?: string[];
    query?: {
      filters?: any[];
      sorts?: any[];
    };
  };
  configFile?: string;
  // Case 3: Resource name
  resource?: string;
  formData: Record<string, any>;
  setFormData: (name: string, value: any) => void;
  dependencyValues?: Record<string, any>;
  id?: string;
  field?: any;
}

const InputSelect: React.FC<InputSelectProps> = ({
  name,
  label,
  required = false,
  read_only = false,
  disabled = false,
  grid_columns,
  input_width,
  dependencies = [],
  multi = false,
  selectHandler,
  selectParser,
  currentSelection,
  fields_to_extract = [],
  // Case 1
  options,
  columnConfig,
  // Case 2
  queryInfo,
  configFile,
  // Case 3
  resource,
  formData,
  setFormData,
  dependencyValues = {},
  id,
  field
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [displayValue, setDisplayValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<{ key: string; as: string }[]>([]);

  // Support both new and old API
  const actualName = name || (field && field.name);
  const actualLabel = label || (field && field.label);
  const actualRequired = required || (field && field.required) || false;

  // Check if component should be disabled based on dependencies
  const isDependencyDisabled = dependencies.length > 0 && 
    dependencies.some(dep => !dependencyValues[dep]);

  // Determine if component should be disabled
  const isDisabled = disabled || isDependencyDisabled || read_only;

  // Format display value based on current selection
  useEffect(() => {
    if (formData[actualName]) {
      if (Array.isArray(formData[actualName])) {
        // For multi-select
        setDisplayValue(formData[actualName].length > 0 
          ? `${formData[actualName].length} item(s) selected` 
          : '');
      } else if (typeof formData[actualName] === 'object' && formData[actualName] !== null) {
        // For single object selection
        if (fields.length > 0) {
          setDisplayValue(formData[actualName][fields[0].key] || '');
        }
      } else {
        // For simple value
        setDisplayValue(formData[actualName].toString());
      }
    } else {
      setDisplayValue('');
    }
  }, [formData[actualName], actualName, fields]);

  // Load data when modal opens
  const handleOpenModal = async () => {
    if (isDisabled) return;
    
    setIsModalOpen(true);
    setIsLoading(true);
    setError('');
    
    try {
      // Case 1: Options array and columnConfig
      if (options) {
        setData(options.map(opt => ({ value: opt.value, label: opt.label })));
        setFields(columnConfig || [{ key: 'value', as: 'Value' }, { key: 'label', as: 'Label' }]);
      } 
      // Case 2: QueryInfo and columnConfig
      else if (queryInfo && configFile) {
        const response = await executeQueryApiCall({
          configFile: configFile,
          path: queryInfo.path,
          payload: queryInfo.payload || [],
          fetchQuery: queryInfo.query || {}
        });
        
        setData(response || []);
        setFields(columnConfig || []);
      } 
      // Case 3: Resource name
      else if (resource) {
        // First get the config
        const configResponse = await postApiCall('/api/generic/getConfig', { 
          configFile: resource 
        }, true);
        
        if (!configResponse.data) {
          throw new Error('Failed to load resource configuration');
        }
        
        const resourceConfig = configResponse.data;
        
        // Then execute the query
        const queryResponse = await executeQueryApiCall({
          configFile: resource,
          path: resourceConfig[0]?.queryInfo?.path || [],
          payload: [],
          fetchQuery: {}
        });
        
        setData(queryResponse || []);
        setFields(columnConfig || resourceConfig[0]?.columnConfig || []);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selection from modal
  const handleSelect = (fieldName: string, selectedValue: any) => {
    if (selectHandler && typeof window[selectHandler] === 'function') {
      // Use the selectHandler function if provided
      window[selectHandler](selectedValue, (name: string, value: any) => {
        setFormData(name, value);
      }, fields_to_extract);
    } else {
      // Default handling
      setFormData(fieldName, selectedValue);
    }
  };

  return (
    <BaseInput
      label={actualLabel}
      required={actualRequired}
      gridColumns={grid_columns}
      inputWidth={input_width}
    >
      <div className={styles.selectInputContainer}>
        <input
          type="text"
          className={styles.selectInput}
          defaultValue={formData[actualName] || ''}
          readOnly
          placeholder="Click to select..."
          onClick={handleOpenModal}
          disabled={isDisabled}
        />
        <button 
          type="button"
          className={styles.selectButton}
          onClick={handleOpenModal}
          disabled={isDisabled}
        >
          ▼
        </button>
      </div>
      
      {isLoading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      {isModalOpen && (
        <SelectModal
          onClose={() => setIsModalOpen(false)}
          title={`Select ${actualLabel}`}
          fieldname={actualName}
          data={data}
          onSelect={handleSelect}
          fields={fields}
          isMulti={multi}
        />
      )}
    </BaseInput>
  );
};

export default InputSelect;