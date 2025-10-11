import React, { useEffect, useState } from 'react';
import { loadFormData } from '../../utils/formPersistence';
import { getActiveTab, getOrderedTabs } from '@/storage/tabs';
import { ACTIVE_TAB_CHANGED, TAB_CREATED, TAB_REMOVED } from '@/events/constants';
import { bcm } from '@/events/base';
import Form from './Form';

// This component handles the integration between tabs and forms
// It ensures forms are restored when tabs are reopened
const FormTabIntegration: React.FC = () => {
  const [openForms, setOpenForms] = useState<Record<string, any>>({});
  
  // Load forms for all open tabs
  useEffect(() => {
    const loadFormsForOpenTabs = () => {
      const tabs = getOrderedTabs();
      const activeTabId = getActiveTab();
      
      // Create a map of tab IDs to form configurations
      const formConfigs: Record<string, any> = {};
      
      tabs.forEach(tab => {
        // Extract form ID from tab ID if it follows the pattern {formName}-{randomId}
        const formId = tab.id.split('-')[0];
        if (formId) {
          // Try to load saved form data
          const savedFormData = loadFormData(formId);
          if (savedFormData) {
            formConfigs[tab.id] = {
              formId,
              fields: tab.formFields || [], // Form fields should be stored in the tab
              initialData: savedFormData
            };
          }
        }
      });
      
      setOpenForms(formConfigs);
    };
    
    // Initial load
    loadFormsForOpenTabs();
    
    // Set up event listeners for tab changes
    const handleTabEvent = () => loadFormsForOpenTabs();
    
    bcm.register(TAB_CREATED, handleTabEvent);
    bcm.register(TAB_REMOVED, handleTabEvent);
    bcm.register(ACTIVE_TAB_CHANGED, handleTabEvent);
    
    return () => {
      bcm.deregister(TAB_CREATED, handleTabEvent);
      bcm.deregister(TAB_REMOVED, handleTabEvent);
      bcm.deregister(ACTIVE_TAB_CHANGED, handleTabEvent);
    };
  }, []);
  
  // This component doesn't render anything directly
  // It's meant to be used as a provider that ensures forms are restored
  return null;
};

// Higher-order component to wrap a form with tab integration
export const withTabIntegration = (FormComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { formId, ...restProps } = props;
    const [savedData, setSavedData] = useState<Record<string, any> | null>(null);
    
    useEffect(() => {
      // Load saved form data when the component mounts
      const data = loadFormData(formId);
      if (data) {
        setSavedData(data);
      }
    }, [formId]);
    
    // Only render the form once we've checked for saved data
    return <FormComponent {...restProps} initialData={savedData || props.initialData} />;
  };
};

export default FormTabIntegration;