/* eslint-disable @typescript-eslint/no-explicit-any */
import { postApiCall } from '../../api/base';
import { IFetchQuery } from './types';

export const fetchData = async (
  url: string,
  config: string,
  setData: (name: string, data: any) => void,
  initData: (name: string) => void,
  setLoading: (loading: boolean) => void,
  showSnackbar: (msg: string) => void,
  name: string,
  fetchQuery?: IFetchQuery,
) => {
  console.log(name, 'fetchQuery', fetchQuery);
  initData(name);
  try {
    setLoading(true);
    const response = await postApiCall(url, { configFile: config, fetchQuery }, true);
    console.log(response.data, "response");
    setData(name, response.data || []);
  } catch (error) {
    showSnackbar('Error fetching data');
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};
