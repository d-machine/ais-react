import { TAuthStore } from "@/types";

export function getIsLoggedIn(state: TAuthStore): boolean | undefined {
  return state.isLoggedIn;
}

export function getToken(state: TAuthStore): string | undefined {
  return state.token;
}

export function getRefreshToken(state: TAuthStore): string | undefined {
  return state.refreshToken;
}
