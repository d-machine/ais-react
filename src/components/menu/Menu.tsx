import { useState, useRef, useEffect } from 'react';
import { MenuItem } from './types';
import MenuList from './MenuList';
import styles from './Menu.module.css';

const MENU_ITEMS: MenuItem[] = [
  {
    label:'Party',
    children:[
      {label:'PartyMater',action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('PartyMaster', Form_tab_map) },
      {label:'PartyCategoryMaster',action: (addTab: (formId: string, form_tab_map: { [key: string]: string })=> void) => addTab('PartyCategoryMaster', Form_tab_map)},
      {label:'PartyTypeMaster',action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('PartyTypeMaster', Form_tab_map)}
    ]
  },{
    label:'Inventory',
    children:[
      {label:'ItemMaster',action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('ItemMaster', Form_tab_map) },
      {label:'ItemCategoryMaster',action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('ItemCategoryMaster', Form_tab_map)},
      {label:'ItemBrandMaster',action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) =>void) => addTab('ItemBrandMaster', Form_tab_map)},
      ]
  },{
  label:'LocationMaster',
  children:[
    { label: 'Country', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('Country', Form_tab_map) },
    { label: 'State', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('State', Form_tab_map) },
    { label: 'District', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('District', Form_tab_map) },
    { label: 'City', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('City', Form_tab_map) }
  ]
}
];

const Form_tab_map:{[key:string]:string} = {};

export default function Menu({addTab}: {addTab: (formId:string,form_tab_map:{[key:string]:string}) => void}) {
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