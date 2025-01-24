import { create } from 'zustand';
import { Tab } from './components/tabs/types';
import axios from 'axios';
import EntryList from './components/Users/EntryList';
import accessToken from '../accesstoken';

interface TabsState {
  tabs: Tab[];
  formTabMap: { [key: string]: string };
  addTab: (formId: string,name:string, listConfigFile: string) => Promise<void>;
  updateTabStatus: (tabId: string, newStatus: string) => void;
}

const useTabsStore = create<TabsState>((set, get) => ({
  tabs: [],
  formTabMap: {},
  addTab: async (formId: string,name: string, listConfigFile: string) => {
    const { tabs, formTabMap } = get();

    if (formId in formTabMap) {
      const _tabId = formTabMap[formId];
      const updatedTabs = tabs.map((tab) => ({
        ...tab,
        status: tab.id === _tabId ? 'ACTIVE' : tab.status === 'CLOSE' ? 'CLOSE' : 'OPEN',
      }));
      set({ tabs: updatedTabs });
      return;
    }

    const newTabId = `tab${tabs.length + 1}`;
    formTabMap[formId] = newTabId;
    let content;
    if (formId === '6' || formId === '7') {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/generic/getConfig',
          { configFile: listConfigFile },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        content = <EntryList name={name} list_config={response.data} list={listConfigFile} />;
      } catch (error) {
        console.error('Error fetching menu:', error);
        content = <div>Error fetching content</div>;
      }
    } else {
      content = <div>Unknown formId</div>;
    }

    const newTab: Tab = {
      id: newTabId,
      title: name,
      content: content,
      status: 'ACTIVE',
    };

    const activeTabIndex = tabs.findIndex((tab) => tab.status === 'ACTIVE');
    if (activeTabIndex !== -1) {
      const updatedTabs = [...tabs];
      updatedTabs[activeTabIndex] = { ...updatedTabs[activeTabIndex], status: 'OPEN' };
      set({ tabs: [...updatedTabs, newTab] });
    } else {
      set({ tabs: [...tabs, newTab] });
    }
  },
  updateTabStatus: (tabId: string, newStatus: string) => {
    set((state) => {
      const updatedTabs = state.tabs.map((tab) => {
        if (tab.id === tabId) {
          return { ...tab, status: newStatus };
        }
        if (newStatus === 'ACTIVE' && tab.id !== tabId) {
          return { ...tab, status: tab.status === 'CLOSE' ? 'CLOSE' : 'OPEN' };
        }
        return tab;
      });

      return { tabs: updatedTabs };
    });
  },
}));

export default useTabsStore;
