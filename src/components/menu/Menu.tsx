import { useState, useRef, useEffect } from 'react';
import { MenuItem } from './types';
import MenuList from './MenuList';
import styles from './Menu.module.css';
import useTabsStore from '../../useTabsStore';
import { postApiCall } from '../../api/base';
export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { addTab } = useTabsStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

 useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await postApiCall('http://localhost:3000/api/generic/getMenu', {}, true);
        setMenuItems(response.data.children);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.blur();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleItemClick = (item: any) => {
    if (!item.children) {
      addTab((item.id).toString(),item.name, item.list_config_file);
      closeMenu();
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        ref={buttonRef}
        className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
      {isOpen && (
        <MenuList items={menuItems} onItemClick={handleItemClick} />
      )}
    </div>
  );
}
