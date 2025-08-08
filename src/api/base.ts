import axios from "axios";
import { logIn, logOut } from "./auth/actions";
import { getRefreshToken, getToken } from "./auth/selectors";
import useAuthStore from "./auth/store";
import { _isNil } from "@utils/aisLodash";

const BASE_URL = "http://localhost:3000";

export async function loginApiCall(username: string, password: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
    const { token, refreshToken } = response.data;
    console.log(token, refreshToken);
    setAuthorizationHeader(token);
    logIn(token, refreshToken);
  } catch (error: unknown) {
    alert((error as { message: string }).message);
  }
}

export async function refreshTokenApiCall(refreshToken: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;
    setAuthorizationHeader(token);
    logIn(token, newRefreshToken);
    return true;
  } catch (error: unknown) {
    alert((error as { message: string }).message);
    logOut();
    return false;
  }
}

export async function logoutApiCall() {
  try {
    const token = getToken(useAuthStore.getState());
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.post(`${BASE_URL}/api/auth/logout`, {}, { headers });
    //await axios.post(`${BASE_URL}/api/auth/logout`);
    logOut();
  } catch (error: unknown) {
    alert((error as { message: string }).message);
  }
}

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function postApiCall(url: string, data: any, isAuthRequired: boolean=true) {
  if (isAuthRequired) {
    console.log("postApiCall");
    return axiosInstance.post(url, data);
  } else {
    console.log("postApi");
    
    return axios.post(url, data);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiCall(url: string, params: any, isAuthRequired: boolean) {
  if (isAuthRequired) {
    return axiosInstance.get(url, { params });
  } else {
    return axios.get(url, { params });
  }
}

export function setAuthorizationHeader(token: string) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = getRefreshToken(useAuthStore.getState());
      if (_isNil(refreshToken)) {
        logOut();
      } else {
        if (await refreshTokenApiCall(refreshToken)) {
          return axiosInstance(error.config);
        }
      }
    }
    return Promise.reject(error);
  }
);

