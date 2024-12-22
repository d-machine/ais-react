import { Tab } from './types';
import styles from './Tabs.module.css';

interface TabHeaderProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void; 
  closeTab:(tabId:string)=>void;
}

export default function TabHeader({closeTab, tabs, activeTabId, onTabChange }: TabHeaderProps) {
  return (
<div className={styles.tabHeader}>
  {tabs.map(tab => 
    tab.status === "CLOSE" ? null : (
      <button
        key={tab.id}
        className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
        onClick={() => onTabChange(tab.id)}
        onDoubleClick={() => closeTab(tab.id)}
      >
        {tab.title}
      </button>
    )
  )}
</div>

  );
}
