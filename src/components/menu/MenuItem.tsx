import { useState, useRef } from 'react';
import { MenuItem } from '@/types';
import MenuList from './MenuList';
import styles from './Menu.module.css';

interface MenuItemProps {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
}

export default function MenuItemComponent({ item, onItemClick }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleMouseEnter = () => {
    if (hasChildren) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasChildren) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (!hasChildren) {
      onItemClick(item);
    }
  };

  return (
    <div 
      ref={itemRef} 
      className={styles.menuItemContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`${styles.menuItem} ${hasChildren ? styles.hasChildren : ''}`}
        onClick={handleClick}
      >
        {item.name}
      </button>
      {hasChildren && isOpen && (
        <MenuList
          items={item.children!}
          onItemClick={onItemClick}
          isSubmenu
        />
      )}
    </div>
  );
}
