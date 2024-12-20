import { Tab } from './types';
import styles from './Tabs.module.css';

interface TabHeaderProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void; 
}

export default function TabHeader({ tabs, activeTabId, onTabChange }: TabHeaderProps) {
  return (
    <div className={styles.tabHeader}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}
