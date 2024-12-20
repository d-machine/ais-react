import { useState, useEffect } from 'react';
import { Tab } from './types';
import TabHeader from './TabHeader';
import styles from './Tabs.module.css';

interface TabContainerProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export default function TabContainer({ tabs, defaultTabId }: TabContainerProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id || '');

  useEffect(() => {
    if (!activeTabId && tabs.length > 0) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={styles.tabContainer}>
      <button onClick={()=>{console.log(tabs);
      }}>open</button>
      <TabHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
      />
      <div className={styles.tabContent}>
        {activeTab?.content}
      </div>
    </div>
  );
}
