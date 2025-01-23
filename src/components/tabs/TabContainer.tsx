import { Tab } from './types';
import TabHeader from './TabHeader';
import styles from './Tabs.module.css';
import useTabsStore from '../../useTabsStore';

interface TabContainerProps {
  tabs: Tab[];
}

export default function TabContainer({ tabs }: TabContainerProps) {
  const { updateTabStatus } = useTabsStore();
  const activeTab = tabs.find((tab) => tab.status === 'ACTIVE');

  const handleTabChange = (tabId: string) => {
    updateTabStatus(tabId, 'ACTIVE');
  };

  const closeTab = (tabId: string) => {
    const toCloseTab = tabs.find((tab) => tab.id === tabId);
    if (toCloseTab?.status === 'ACTIVE') {
      const toActiveTab = tabs.find((tab) => tab.status === 'OPEN');
      updateTabStatus(tabId, 'CLOSE');
      if (toActiveTab) {
        updateTabStatus(toActiveTab.id, 'ACTIVE');
      }
    } else {
      updateTabStatus(tabId, 'CLOSE');
    }
  };

  return (
    <div className={styles.tabContainer}>
      <TabHeader tabs={tabs} activeTabId={activeTab?.id || ''} onTabChange={handleTabChange} closeTab={closeTab} />
      <div className={styles.tabContent}>{activeTab?.content}</div>
    </div>
  );
}
