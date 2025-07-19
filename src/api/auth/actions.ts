import useAuthStore from "./store"

export function logIn(token: string, refreshToken: string) {
  useAuthStore.setState({ token, refreshToken, isLoggedIn: true });
}

export function logOut() {
  useAuthStore.setState({ token: undefined, refreshToken: undefined, isLoggedIn: false });
}