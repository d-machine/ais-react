import useTabsStore from './useTabsStore';
import styles from './Tabs.module.css';

interface TabHeaderProps {
  activeTabId: string;
  onTabChange: (tabId: string) => void; 
  closeTab:(tabId:string)=>void;
}

export default function TabHeader({closeTab, activeTabId, onTabChange }: TabHeaderProps) {
  const {tabs} = useTabsStore();
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
