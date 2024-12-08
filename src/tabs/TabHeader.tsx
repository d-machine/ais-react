import { Tab } from './types';
import styles from './Tabs.module.css';

interface TabHeaderProps {
  tabs: Tab[];
  activeId: string;
  onTabChange: (id: string) => void;
}

export default function TabHeader({ tabs, activeId, onTabChange }: TabHeaderProps) {
  return (
    <div className={styles.tabHeader}>
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`${styles.tab} ${tab.id === activeId ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className={styles.tabContent}>
            <span>{tab.title}</span>
            <div 
              className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                // Close functionality will be added later
              }}
            >
              ×
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 