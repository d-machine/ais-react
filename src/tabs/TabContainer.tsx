import { useState, useEffect } from 'react';
import { Tab } from './types';
import TabHeader from './TabHeader';
import styles from './Tabs.module.css';

interface TabContainerProps {
  tabs: Tab[];
}

export default function TabContainer({ tabs }: TabContainerProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (tabs.length > 0 && !activeId) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId]);

  const activeTab = tabs.find(tab => tab.id === activeId);

  return (
    <div className={styles.tabContainer}>
      <TabHeader 
        tabs={tabs}
        activeId={activeId}
        onTabChange={setActiveId}
      />
      <div className={styles.tabContent}>
        {activeTab?.content || ''}
      </div>
    </div>
  );
} 