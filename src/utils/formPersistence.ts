/**
 * Utility functions for persisting form data in localStorage
 */

const FORM_DATA_PREFIX = 'form_data_';

/**
 * Save form data to localStorage
 * @param formId Unique identifier for the form
 * @param data Form data to save
 */
export const saveFormData = (formId: string, data: Record<string, any>): void => {
  try {
    localStorage.setItem(`${FORM_DATA_PREFIX}${formId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

/**
 * Load form data from localStorage
 * @param formId Unique identifier for the form
 * @returns The saved form data or null if not found
 */
export const loadFormData = (formId: string): Record<string, any> | null => {
  try {
    const savedData = localStorage.getItem(`${FORM_DATA_PREFIX}${formId}`);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading form data from localStorage:', error);
    return null;
  }
};

/**
 * Clear form data from localStorage
 * @param formId Unique identifier for the form
 */
export const clearFormData = (formId: string): void => {
  try {
    localStorage.removeItem(`${FORM_DATA_PREFIX}${formId}`);
  } catch (error) {
    console.error('Error clearing form data from localStorage:', error);
  }
};

/**
 * Get all saved form IDs
 * @returns Array of form IDs that have saved data
 */
export const getSavedFormIds = (): string[] => {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(FORM_DATA_PREFIX))
      .map(key => key.substring(FORM_DATA_PREFIX.length));
  } catch (error) {
    console.error('Error getting saved form IDs from localStorage:', error);
    return [];
  }
};

/**
 * Check if a form has saved data
 * @param formId Unique identifier for the form
 * @returns True if form data exists in localStorage
 */
export const hasFormData = (formId: string): boolean => {
  try {
    return localStorage.getItem(`${FORM_DATA_PREFIX}${formId}`) !== null;
  } catch (error) {
    console.error('Error checking for form data in localStorage:', error);
    return false;
  }
};