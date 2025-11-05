import React from 'react';
import { useForm } from '@tanstack/react-form';
import InputText from '../Input/InputText';
import InputTextArea from '../Input/InputTextArea';
import InputSelect from '../Input/InputSelect';
import InputPassword from '../Input/InputPassowrd';
import { EFieldType } from '../Input/types';
import styles from './Form.module.css';

interface TanStackFormProps {
  id: string;
  fields: any[];
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  submitLabel?: string;
}

const INPUT_MAP = {
  [EFieldType.PASSWORD]: InputPassword,
  [EFieldType.TEXT]: InputText,
  [EFieldType.SELECT]: InputSelect,
  [EFieldType.TEXTAREA]: InputTextArea,
  text: InputText,
  textarea: InputTextArea,
  select: InputSelect,
  password: InputPassword,
};

const TanStackForm: React.FC<TanStackFormProps> = ({ 
  id, 
  fields, 
  onSubmit, 
  initialData = {},
  submitLabel = 'Submit'
}) => {
  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      onSubmit(value);
    },
  });

  // Get dependency values for fields with dependencies
  const getDependencyValues = (dependencies: string[] = []) => {
    const values: Record<string, any> = {};
    dependencies.forEach(dep => {
      values[dep] = form.getFieldValue(dep) || null;
    });
    return values;
  };

  const renderField = (field: any) => {
    const InputComponent = INPUT_MAP[field.type as keyof typeof INPUT_MAP];
    
    if (!InputComponent) {
      console.warn(`Unknown field type: ${field.type}`);
      return null;
    }

    return (
      <form.Field
        key={field.name}
        name={field.name}
        validators={{
          onChange: field.required 
            ? ({ value }) => !value ? 'This field is required' : undefined
            : undefined,
        }}
      >
        {(fieldApi) => {
          const currentFormData = { [field.name]: fieldApi.state.value };
          
          return (
            <div className="field-wrapper">
              <InputComponent
                name={field.name}
                label={field.label}
                required={field.required}
                read_only={field.read_only}
                disabled={field.disabled}
                grid_columns={field.grid_columns}
                input_width={field.width}
                dependencies={field.dependencies || []}
                formData={currentFormData}
                setFormData={(name: string, value: any) => {
                  fieldApi.handleChange(value);
                }}
                dependencyValues={getDependencyValues(field.dependencies)}
                id={id}
                field={field}
                // For select fields
                multi={field.multi}
                selectHandler={field.selectHandler}
                selectParser={field.selectParser}
                currentSelection={field.currentSelection}
                fields_to_extract={field.fields_to_extract}
                selectConfig={field.selectConfig}
                options={field.options}
                query={field.query}
                selectedValues={{}}
                setSelectedValues={() => {}}
              />
              {fieldApi.state.meta.touchedErrors && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                  {fieldApi.state.meta.touchedErrors[0]}
                </div>
              )}
            </div>
          );
        }}
      </form.Field>
    );
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className={styles.form}
      >
        <div className={styles.formGrid}>
          {fields.map(field => renderField(field))}
        </div>
        
        <div className={styles.formActions}>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={!canSubmit}
              >
                {isSubmitting ? 'Submitting...' : submitLabel}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
};

export default TanStackForm;