// api/auth
export type TAuthStore = {
  token?: string;
  refreshToken?: string;
  isLoggedIn?: boolean;
}

// components/menu
export interface MenuItem {
  name: string;
  label: string;
  children?: MenuItem[];
  action?: (...args: any[]) => void;
}

// components/tabs
export interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
  status: string;
}

