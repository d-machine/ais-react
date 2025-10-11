import { getAllKeys, getJSON, getString, remove, setJSON, setString } from "./base";
import { ACTIVE_TAB_CHANGED, TAB_CREATED, TAB_REMOVED } from "../events/constants";
import { ACTIVE_TAB, TAB_ORDER, TAB_PREFIX } from "./contants";
import { bcm } from "@/events/base";

export function createTabKey(tabId: string): string {
  return TAB_PREFIX + tabId;
}

export function createNewTab(tab: any): void {
  if (tabExists(tab.id)) {
    // If tab already exists, just set it as active
    setActiveTab(tab.id);
    return;
  }
  
  // Store the tab data
  setJSON(createTabKey(tab.id), tab);
  
  // Update tab order
  const tabOrder = getTabOrder();
  tabOrder.push(tab.id);
  setTabOrder(tabOrder);
  
  // Set as active tab
  setActiveTab(tab.id);
  
  // Broadcast tab created event
  bcm.broadcast({ type: TAB_CREATED });
}
  
export function removeTab(tabId: string): void {
  // Remove tab data
  remove(createTabKey(tabId));
  
  // Remove from tab order
  const tabOrder = getTabOrder();
  const updatedOrder = tabOrder.filter(id => id !== tabId);
  setTabOrder(updatedOrder);
  
  // Broadcast tab removed event
  bcm.broadcast({ type: TAB_REMOVED });
  
  // Handle active tab change if needed
  const activeTab = getActiveTab();
  if (activeTab === tabId) {
    if (updatedOrder.length > 0) {
      // Set the most recently used tab as active
      setActiveTab(updatedOrder[updatedOrder.length - 1]);
    } else {
      setString(ACTIVE_TAB, '');
      bcm.broadcast({ type: ACTIVE_TAB_CHANGED });
    }
  }
}

export function tabExists(tabId: string): boolean {
  return getTab(tabId) !== null;
}

export function getTab(tabId: string): any | null {
  return getJSON(createTabKey(tabId));
}

export function getAllTabIds(): any[] {
  return getAllKeys(TAB_PREFIX).map(key => key.replace(TAB_PREFIX, ''));
}

export function getTabOrder(): string[] {
  const order = getJSON<string[]>(TAB_ORDER);
  return order || [];
}

export function setTabOrder(tabOrder: string[]): void {
  setJSON(TAB_ORDER, tabOrder);
}

export function setActiveTab(tabId: string): void {
  if (!tabExists(tabId)) {
    return;
  }
  
  // Move tab to the end of the order (most recently used)
  const tabOrder = getTabOrder();
  const updatedOrder = tabOrder.filter(id => id !== tabId);
  updatedOrder.push(tabId);
  setTabOrder(updatedOrder);
  
  // Set active tab
  setString(ACTIVE_TAB, tabId);
  bcm.broadcast({ type: ACTIVE_TAB_CHANGED });
}

export function getActiveTab(): string | null {
  return getString(ACTIVE_TAB);
}

export function getOrderedTabs(): any[] {
  const tabOrder = getTabOrder();
  return tabOrder.map(tabId => getTab(tabId)).filter(tab => tab !== null);
}
