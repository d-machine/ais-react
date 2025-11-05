import React from 'react';
import { useForm } from '@tanstack/react-form';
import styles1 from "@styles/user.module.css";
import TanStackInputText from "./TanStackInputText";
import TanStackInputTextArea from "./TanStackInputTextArea";
import TanStackInputSelect from "./TanStackInputSelect";
import styles from "./Input.module.css"
import { EFieldType } from "./types";
import { useAddStore } from "@components/EntryList/useAddStore";
import { postApiCall } from "@api/base";
import { useSnackbar } from "@utils/useSnackBar";

const INPUT_MAP = {
  [EFieldType.PASSWORD]: TanStackInputText, // Using text input for password for now
  [EFieldType.TEXT]: TanStackInputText,
  [EFieldType.SELECT]: TanStackInputSelect,
  [EFieldType.TEXTAREA]: TanStackInputTextArea,
  // Support string field types as well
  'text': TanStackInputText,
  'textarea': TanStackInputTextArea,
  'select': TanStackInputSelect,
  'password': TanStackInputText,
};

interface TanStackInputProps {
  configFile: string;
  formId: string;
  section: any;
  setIsModalOpen: (value: boolean) => void;
  formData: { [key: string]: string | number };
  selectedValues: { [key: string]: { id: string | number; name: string } };
  setSelectedValues: (id: string, name: string, value: { id: string | number; name: string }) => void;
  setFormData: (id: string, name: string, value: string | number) => void;
}

export default function TanStackInput({ 
  configFile, 
  formId, 
  section, 
  formData, 
  selectedValues, 
  setSelectedValues, 
  setFormData, 
  setIsModalOpen 
}: TanStackInputProps) {
  const { entries } = useAddStore();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  // Create default values from existing formData
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};
    section.fields?.forEach((field: any) => {
      defaults[field.name] = formData[field.name] || '';
    });
    return defaults;
  };

  const form = useForm({
    defaultValues: getDefaultValues(),
    onSubmit: async ({ value }) => {
      console.log('TanStack Form submitted:', value);
      
      // Update the existing store with form values
      Object.entries(value).forEach(([key, val]) => {
        setFormData(formId, key, val as string | number);
      });
      
      // Execute the action using the existing logic
      const actionKey = section.applicableActions[0]; // Usually there's a primary action
      if (actionKey) {
        await handleOnClick(actionKey, value);
      }
    },
  });

  const handleOnClick = async (actionKey: string, formValues?: Record<string, any>) => {
    console.log(section);
    const currentData = formValues || entries[formId].metadata;
    console.log(currentData);
    console.log(configFile);

    const action = section.actionConfig[actionKey];
    console.log(action.queryInfo.path);

    if (!action || action.actionType !== "EXECUTE_QUERY") return;
    
    // Use form values if provided, otherwise use store data
    const payload = action.queryInfo.payload?.map((key: string) => currentData[key] ?? "undefined") || [];
    console.log("Payload:", payload);
    
    try {
      const response = await postApiCall(
        "api/generic/executeQuery",
        {
          configFile,
          fetchquery: action.queryInfo.query,
          payload,
          path: action.queryInfo.path
        },
        true
      );

      console.log("API Response:", response);
      showSnackbar('Data saved successfully!');
      
      // Close the modal after successful submission
      setIsModalOpen(false);
    } catch (error) {
      console.error("Unexpected error during API call:", error);
      showSnackbar('Error saving data. Please try again.');
    } finally {
      console.log("API call completed");
    }
  };

  return (
    <>
      <SnackbarComponent />
      <h2>{section.sectionName}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className={styles.parent}>
          {section.fields?.map((field: any) => {
            console.log(field);
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
                  // Get dependency values for this field
                  const getDependencyValues = (dependencies: string[] = []) => {
                    const values: Record<string, any> = {};
                    dependencies.forEach(dep => {
                      values[dep] = form.getFieldValue(dep) || null;
                    });
                    return values;
                  };
                  
                  return (
                    <div 
                      key={field.name}
                      className={styles.child}
                      style={{ gridColumn: "span 20", gap: "10px" }}
                    >
                      <InputComponent
                        field={field}
                        fieldApi={fieldApi}
                        dependencies={field.dependencies || []}
                        dependencyValues={getDependencyValues(field.dependencies)}
                        configFile={configFile}
                      />
                    </div>
                  );
                }}
              </form.Field>
            );
          })}
        </div>
        
        <div className={styles1.buttonContainer}>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <>
                {section.applicableActions.map((actionKey: string, index: number) => {
                  const action = section.actionConfig[actionKey as keyof typeof section.actionConfig];
                  return (
                    <button
                      key={index}
                      type="submit"
                      className={styles1.actionButton}
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? 'Processing...' : action.label}
                    </button>
                  );
                })}
              </>
            )}
          </form.Subscribe>
        </div>
      </form>
    </>
  );
}