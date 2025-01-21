import { useState, useRef, useEffect } from 'react';
import { MenuItem } from './types';
import MenuList from './MenuList';
import styles from './Menu.module.css';

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Administration',
    children: [
      { label: 'User Management', action: (addTab: (formId: string) => void) => addTab('UserManagement') },
      { label: 'Role Management', action: (addTab: (formId: string) => void) => addTab('RoleManagement') },
      { label: 'Access Grant Management', action: (addTab: (formId: string) => void) => addTab('AccessGrantManagement') },
      { label: 'Resource Management', action: (addTab: (formId: string) => void) => addTab('ResourceManagement') }
    ]
  },
  {
    label: 'Master Data',
    children: [
      {
        label: 'Geo Location',
        children: [
          { label: 'Country Master', action: (addTab: (formId: string) => void) => addTab('CountryMaster') },
          { label: 'State Master', action: (addTab: (formId: string) => void) => addTab('StateMaster') },
          { label: 'City Master', action: (addTab: (formId: string) => void) => addTab('CityMaster') },
          { label: 'District Master', action: (addTab: (formId: string) => void) => addTab('DistrictMaster') }
        ]
      },
      {
        label: 'Warehouse Management',
        children: [
          { label: 'Rack Master', action: (addTab: (formId: string) => void) => addTab('RackMaster') }
        ]
      },
      {
        label: 'Party Management',
        children: [
          { label: 'Party Master', action: (addTab: (formId: string) => void) => addTab('PartyMaster') },
          { label: 'Party Category Master', action: (addTab: (formId: string) => void) => addTab('PartyCategoryMaster') }
        ]
      },
      {
        label: 'Vendor Management',
        children: [
          { label: 'Vendor Master', action: (addTab: (formId: string) => void) => addTab('VendorMaster') }
        ]
      },
      {
        label: 'Item Management',
        children: [
          { label: 'Item Master', action: (addTab: (formId: string) => void) => addTab('ItemMaster') },
          { label: 'Item Category Master', action: (addTab: (formId: string) => void) => addTab('ItemCategoryMaster') },
          { label: 'Item Brand Master', action: (addTab: (formId: string) => void) => addTab('ItemBrandMaster') },
          { label: 'UOM Master', action: (addTab: (formId: string) => void) => addTab('UOMMaster') },
          { label: 'Unit Conversion Master', action: (addTab: (formId: string) => void) => addTab('UnitConversionMaster') }
        ]
      }
    ]
  },
  {
    label: 'Sales',
    children: [
      { label: 'Sales Order', action: (addTab: (formId: string) => void) => addTab('SalesOrder') },
      { label: 'Picking List', action: (addTab: (formId: string) => void) => addTab('PickingList') },
      { label: 'Dispatch', action: (addTab: (formId: string) => void) => addTab('Dispatch') },
      { label: 'Sales Return', action: (addTab: (formId: string) => void) => addTab('SalesReturn') }
    ]
  },
  {
    label: 'Purchase',
    children: [
      { label: 'Purchase Order', action: (addTab: (formId: string) => void) => addTab('PurchaseOrder') },
      { label: 'Inward', action: (addTab: (formId: string) => void) => addTab('Inward') },
      { label: 'Putaway', action: (addTab: (formId: string) => void) => addTab('Putaway') },
      { label: 'Purchase Return', action: (addTab: (formId: string) => void) => addTab('PurchaseReturn') }
    ]
  }
];


export default function Menu({addTab}: {addTab: (formId:string) => void}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleItemClick = (item: MenuItem) => {
    if (!item.children) {
      // const formId = item.label;
      // addTab( formId,Form_tab_map);
      item.action?.(addTab);
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
        <MenuList 
          items={MENU_ITEMS} 
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
} 