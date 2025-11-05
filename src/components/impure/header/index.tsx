import { logoutApiCall } from '@/api/base';
import Menu from '@components/menu/Menu';
import { createNewTab } from '@/storage/tabs';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const handleLogout = () => {
    logoutApiCall();
  };

  const handleCountriesClick = () => {
    const tab = {
      id: `tab-countries-${Date.now()}`,
      title: 'Countries',
      content: 'Countries Content',
      status: 'ACTIVE',
      resourceId: 'countries',
      listConfigFile: 'list-countries'
    };
    createNewTab(tab);
  };

  return (
    <div className={styles.headerContent}>
      <Menu />
      <h1 className={styles.headerTitle}>{title}</h1>
      <div className={styles.divider} />
      <div className={styles.rightSection}>
        <button 
          className={styles.logoutButton} 
          onClick={handleCountriesClick}
          style={{ marginRight: '10px' }}
        >
          Countries (Test)
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
