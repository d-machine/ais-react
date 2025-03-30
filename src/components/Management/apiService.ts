/* eslint-disable @typescript-eslint/no-explicit-any */
import { postApiCall } from '../../api/base';

export const fetchConfig = async (configFile: string) => {
  try {
    const response = await postApiCall('http://localhost:3000/api/generic/getConfig', { configFile }, true);
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
};

export const executeQuery = async (configFile: string, payload: any, path: string, query?: string) => {
  try {
    const response = await postApiCall('http://localhost:3000/api/generic/executeQuery', { configFile, payload, path, fetchquery: query }, true);
    return response.data;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};
