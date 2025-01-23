import Menu from '../menu/Menu';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  addTab: (formId: string,list_config_file:string) => void;
  children?: React.ReactNode;
}

export default function Header({addTab, title, children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Menu addTab={addTab} />
        <h1>{title}</h1>
        <div className={styles.divider} />
        <div className={styles.rightSection}>
          {children}
        </div>
      </div>
    </header>
  );
} 