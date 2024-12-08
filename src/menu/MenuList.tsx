import { MenuItem } from './types';
import MenuItemComponent from './MenuItem';
import styles from './Menu.module.css';

interface MenuListProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  isSubmenu?: boolean;
}

export default function MenuList({ items, onItemClick, isSubmenu }: MenuListProps) {
  return (
    <div className={`${styles.menuList} ${isSubmenu ? styles.submenu : ''}`}>
      {items.map((item, index) => (
        <MenuItemComponent
          key={`${item.label}-${index}`}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}
