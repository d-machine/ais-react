import { useState, useRef, useEffect } from 'react';
import { MenuItem } from '@/types';
import MenuList from './MenuList';
import styles from './Menu.module.css';
import { getMenuApiCall } from '@/api/api';
import { MENU_UPDATED } from '@/events/constants';
import { getMenu } from '@/storage/data';
import { createNewTab } from '@/storage/tabs';
import { bcm } from '@/events/base';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
 useEffect(() => {
    const handler = () => {
      setMenuItems(getMenu() || []);
    };
    bcm.register(MENU_UPDATED, handler);
    getMenuApiCall();
    return () => {
      bcm.deregister(MENU_UPDATED, handler);
    };
  }, [])

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
    // Only create a tab when a leaf node (no children) is selected
    if (!item.children) {
      // Create a tab object with required properties
      const tab = {
        id: `tab-${item.id}-${Date.now()}`, // Unique ID with timestamp
        title: item.name,
        content: item.content || `Content for ${item.name}`,
        status: 'ACTIVE',
        resourceId: item.id,
        listConfigFile: item.list_config_file
      };
      
      // Create a new tab using our storage system
      createNewTab(tab);
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
