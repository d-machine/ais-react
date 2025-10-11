import styles from './Tabs.module.css';
import { Tab } from '@/types';

interface TabHeaderProps {
  activeTabId: string;
  onTabChange: (tabId: string) => void; 
  closeTab: (tabId: string) => void;
  tabs?: Tab[]; // Make tabs optional to support both useTabsStore and direct props
}

export default function TabHeader({closeTab, activeTabId, onTabChange, tabs = [] }: TabHeaderProps) {
  // Prevent event propagation when clicking the close button
  const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  return (
    <div className={styles.tabHeader}>
      {tabs.map(tab => 
        tab.status === "CLOSE" ? null : (
          <button
            key={tab.id}
            className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={styles.tabTitle}>{tab.title}</span>
            <span 
              className={styles.closeButton}
              onClick={(e) => handleCloseClick(e, tab.id)}
            >
              ×
            </span>
          </button>
        )
      )}
    </div>
  );
}
