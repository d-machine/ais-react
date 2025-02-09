import TabHeader from './TabHeader';
import styles from './Tabs.module.css';
import useTabsStore from '../../useTabsStore';


export default function TabContainer() {
  const { updateTabStatus,tabs } = useTabsStore();
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
      <TabHeader activeTabId={activeTab?.id || ''} onTabChange={handleTabChange} closeTab={closeTab} />
      <div className={styles.tabContent}>
        {tabs.map((tab,index) => (
          <div key={index} className={styles.tabContentChild} style={{visibility: tab.status === 'ACTIVE' ? 'visible' : 'hidden'}}>{tab?.content}</div>
        ))}
      </div>
      {/* <div className={styles.tabContent} style={{visibility:'visible'}}>{activeTab?.content}</div> */}

    </div>
  );
}
