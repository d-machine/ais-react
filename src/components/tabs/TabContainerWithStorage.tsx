import { useEffect, useState } from 'react';
import TabHeader from './TabHeader';
import styles from './Tabs.module.css';
import { Tab } from '@/types';
import { getOrderedTabs, setActiveTab, removeTab, getActiveTab } from '@/storage/tabs';
import { ACTIVE_TAB_CHANGED, TAB_CREATED, TAB_REMOVED } from '@/events/constants';
import { bcm } from '@/events/base';
import EntryList from '@components/EntryList';
import { postApiCall } from '@api/base';

export default function TabContainerWithStorage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Load tabs from storage and listen for changes
  useEffect(() => {
    // Initial load
    loadTabs();

    // Set up event listeners
    const handleTabCreated = () => loadTabs();
    const handleTabRemoved = () => loadTabs();
    const handleActiveTabChanged = () => {
      const activeId = getActiveTab();
      setActiveTabId(activeId);
    };

    // Register event listeners
    bcm.register(TAB_CREATED, handleTabCreated);
    bcm.register(TAB_REMOVED, handleTabRemoved);
    bcm.register(ACTIVE_TAB_CHANGED, handleActiveTabChanged);

    // Cleanup
    return () => {
      bcm.deregister(TAB_CREATED, handleTabCreated);
      bcm.deregister(TAB_REMOVED, handleTabRemoved);
      bcm.deregister(ACTIVE_TAB_CHANGED, handleActiveTabChanged);
    };
  }, []);

  // Load tabs from storage
  const loadTabs = async () => {
    const storedTabs = getOrderedTabs();
    const activeId = getActiveTab();
    
    // Process tabs to ensure they have proper content
    const processedTabs = await Promise.all(storedTabs.map(async (tab) => {
      // If tab already has React content, use it
      if (tab.content && typeof tab.content !== 'string') {
        return tab;
      }
      
      // Otherwise, create content based on tab properties
      if (tab.listConfigFile) {
        try {
          const response = await postApiCall(
            'http://localhost:3000/api/generic/getConfig', 
            { configFile: tab.listConfigFile }, 
            true
          );
          
          return {
            ...tab,
            content: <EntryList 
              name={tab.title} 
              list_config={response.data} 
              list={tab.listConfigFile} 
            />
          };
        } catch (error) {
          console.error('Error fetching config:', error);
          return {
            ...tab,
            content: <div>Error loading content</div>
          };
        }
      }
      
      // Default content if no specific content can be created
      return {
        ...tab,
        content: <div>Content for {tab.title}</div>
      };
    }));
    
    setTabs(processedTabs);
    setActiveTabId(activeId);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const closeTab = (tabId: string) => {
    removeTab(tabId);
  };

  return (
    <div className={styles.tabContainer}>
      <TabHeader 
        activeTabId={activeTabId || ''} 
        onTabChange={handleTabChange} 
        closeTab={closeTab} 
        tabs={tabs.filter(tab => tab.status !== 'CLOSE')}
      />
      <div className={styles.tabContent}>
        {tabs.map((tab, index) => (
          <div 
            key={index} 
            className={styles.tabContentChild} 
            style={{visibility: tab.id === activeTabId ? 'visible' : 'hidden'}}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}