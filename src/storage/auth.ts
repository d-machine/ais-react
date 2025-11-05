import { getBoolean, getString, remove, setBoolean, setString } from "./base";
import { AUTH_CHANGED } from "../events/constants";
import { IS_LOGGED_IN, ACCESS_TOKEN, REFRESH_TOKEN } from "./contants";
import { bcm } from "@/events/base";
import { clearAllConfigs } from "./config";

export function logIn(token: string, refreshToken: string) {
  setBoolean(IS_LOGGED_IN, true);
  setString(ACCESS_TOKEN, token);
  setString(REFRESH_TOKEN, refreshToken);
  console.log("User logged in");
  bcm.broadcast({ type: AUTH_CHANGED });
}

export function logOut() {
  setBoolean(IS_LOGGED_IN, false);
  remove(ACCESS_TOKEN);
  remove(REFRESH_TOKEN);
  // Clear all cached configs on logout
  clearAllConfigs();
  console.log('All configs cleared from cache on logout');
  bcm.broadcast({ type: AUTH_CHANGED });
}

export function getIsLoggedIn(): boolean | null {
  return getBoolean(IS_LOGGED_IN);
}

export function getToken(): string | null {
  return getString(ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return getString(REFRESH_TOKEN);
}

export function setIsLoggedIn(value: boolean): void {
  setBoolean(IS_LOGGED_IN, value);
}
