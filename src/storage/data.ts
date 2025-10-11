import { getJSON, setJSON } from "./base";
import { MENU } from "./contants";

export function setMenu(data: any): void {
  setJSON(MENU, data);
}

export function getMenu(): any | null {
  return getJSON(MENU);
}


