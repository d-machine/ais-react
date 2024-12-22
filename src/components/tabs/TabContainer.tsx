import { Tab } from './types';
import TabHeader from './TabHeader';
import styles from './Tabs.module.css';

interface TabContainerProps {
  tabs: Tab[];
  onTabsUpdate: (updatedTabs: Tab[]) => void; 
}

export default function TabContainer({ tabs, onTabsUpdate }: TabContainerProps) {
  const activeTab = tabs.find(tab => tab.status === 'ACTIVE'); 

  const handleTabChange = (tabId: string) => {
    const updatedTabs = tabs.map(tab => ({
      ...tab,
      status: tab.id === tabId ? 'ACTIVE' :tab.status === 'CLOSE' ? 'CLOSE' : 'OPEN', 
    }));
    onTabsUpdate(updatedTabs); 
  };

  const closeTab = (tabId: string) => {
    const toCloseTab = tabs.find(tab => tab.id === tabId);
    let updatedTabs;
  
    if (toCloseTab?.status === "ACTIVE") {
      const toActiveTab = tabs.find(tab => tab.status === "OPEN");
      updatedTabs = tabs.map(tab => ({
        ...tab,
        status: tab.id === tabId ? "CLOSE" : tab.id === toActiveTab?.id ? "ACTIVE" : tab.status
      }));
    } else {
      updatedTabs = tabs.map(tab => ({
        ...tab,
        status: tab.id === tabId ? "CLOSE" : tab.status
      }));
    }
    onTabsUpdate(updatedTabs);
  };

  return (
    <div className={styles.tabContainer}>
      <button
        onClick={() => {
          console.log(tabs); 
        }}
      >
        Open
      </button>
      <TabHeader tabs={tabs} activeTabId={activeTab?.id || ''} onTabChange={handleTabChange} closeTab={closeTab}/>
      <div className={styles.tabContent}>{activeTab?.content}</div>
    </div>
  );
}
