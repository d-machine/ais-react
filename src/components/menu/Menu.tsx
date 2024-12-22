import { useState, useRef, useEffect } from 'react';
import { MenuItem } from './types';
import MenuList from './MenuList';
import styles from './Menu.module.css';

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'File',
    children: [
      { 
        label: 'New',
        children: [
          { label: 'Project', action: () => console.log('New Project') },
          { label: 'File', action: () => console.log('New File') }
        ]
      },
      { label: 'Open', action: () => console.log('Open') },
      { label: 'Save', action: () => console.log('Save') }
    ]
  },
  {
    label: 'Edit',
    children: [
      { label: 'Undo', action: () => console.log('Undo') },
      { label: 'Redo', action: () => console.log('Redo') }
    ]
  },
  {
    label: 'View',
    children: [
      { label: 'Zoom In', action: () => console.log('Zoom In') },
      { label: 'Zoom Out', action: () => console.log('Zoom Out') }
    ]
  },{
    label: 'Forms',
    children: [
      { label: 'Form1', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('Form1', Form_tab_map) },
      { label: 'Form2', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('Form2', Form_tab_map) },
      { label: 'Form3', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('Form3', Form_tab_map) }
    ]
  },{
    label:'ItemMaster',
    children:[
      { label: 'ItemMaster1', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('ItemMaster1', Form_tab_map) },
      { label: 'ItemMaster2', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('ItemMaster2', Form_tab_map) },
      { label: 'ItemMaster3', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('ItemMaster3', Form_tab_map) }
    ]
},{
  label:'BrandMaster',
  children:[
    { label: 'BrandMaster1', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('BrandMaster1', Form_tab_map) },
    { label: 'BrandMaster2', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('BrandMaster2', Form_tab_map) },
    { label: 'BrandMaster3', action: (addTab: (formId: string, form_tab_map: { [key: string]: string }) => void) => addTab('BrandMaster3', Form_tab_map) }
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