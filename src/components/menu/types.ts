export interface MenuItem {
  label: string;
  children?: MenuItem[];
  action?: (...args: any[]) => void;
}

