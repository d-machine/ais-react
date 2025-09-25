import { logoutApiCall } from '@/api/base';
import Menu from '@components/menu/Menu';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const handleLogout = () => {
    logoutApiCall();
  };

  return (
    <div className={styles.headerContent}>
      <Menu />
      <h1 className={styles.headerTitle}>{title}</h1>
      <div className={styles.divider} />
      <div className={styles.rightSection}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
