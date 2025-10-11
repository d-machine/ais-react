import React, { useState, useEffect } from 'react';
import { saveFormData, loadFormData, clearFormData } from '../../utils/formPersistence';
import InputText from '../Input/InputText';
import InputTextArea from '../Input/InputTextArea';
import InputSelect from '../Input/InputSelect';
import styles from './Form.module.css';

interface FormProps {
  id: string;
  fields: any[];
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

const Form: React.FC<FormProps> = ({ id, fields, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load form data from localStorage on initial render
  useEffect(() => {
    const savedData = loadFormData(id);
    if (savedData) {
      setFormData(savedData);
    } else if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [id, initialData]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormData(id, formData);
    }
  }, [formData, id]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit the form data
    onSubmit(formData);
    
    // Clear form data from localStorage after successful submission
    clearFormData(id);
  };

  // Get dependency values for fields with dependencies
  const getDependencyValues = (dependencies: string[] = []) => {
    const values: Record<string, any> = {};
    dependencies.forEach(dep => {
      values[dep] = formData[dep] || null;
    });
    return values;
  };

  const renderField = (field: any) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      required: field.required,
      read_only: field.read_only,
      disabled: field.disabled,
      grid_columns: field.grid_columns,
      input_width: field.width,
      dependencies: field.dependencies || [],
      formData,
      setFormData: handleInputChange,
      dependencyValues: getDependencyValues(field.dependencies)
    };

    switch (field.type) {
      case 'text':
        return <InputText key={field.name} {...commonProps} />;
      case 'textarea':
        return <InputTextArea key={field.name} {...commonProps} />;
      case 'select':
        return (
          <InputSelect 
            key={field.name} 
            {...commonProps}
            multi={field.multi}
            selectHandler={field.selectHandler}
            selectParser={field.selectParser}
            currentSelection={field.currentSelection}
            fields_to_extract={field.fields_to_extract}
            options={field.options}
            query={field.query}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        {fields.map(field => renderField(field))}
      </div>
      
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;