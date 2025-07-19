import Menu from '@components/menu/Menu';
import styles from '@styles/Header.module.css';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Menu />
        <h1>{title}</h1>
        <div className={styles.divider} />
        <div className={styles.rightSection}>{children}</div>
      </div>
    </header>
  );
}
