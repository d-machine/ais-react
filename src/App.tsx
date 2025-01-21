import  { useState } from 'react';
import Header from './components/header/Header';
import { Tab } from './components/tabs/types';
import styles from './App.module.css';
import EntryForm from './components/EntryForm/EntryForm';
import CountryMaster from './components/EntryForm/CountryMaster';
import StateMaster from './components/EntryForm/StateMaster';
import DistrictMaster from './components/EntryForm/DistrictMaster';
import CityMaster from './components/EntryForm/CityMaster';
import ItemCategoryMaster from './components/EntryForm/ItemCategoryMaster';
import ItemBrandMaster from './components/EntryForm/ItemBrandMaster';
import PartyCategoryMaster from './components/EntryForm/PartyCategoryMaster';
import PartyTypeMaster from './components/EntryForm/PartyTypeMaster';
import ItemMaster from './components/EntryForm/ItemMaster';
import TabContainer from './components/tabs/TabContainer';

import RoleEntryList from './components/Users/RoleEntryList';

const DEMO_TABS: Tab[] = [
];

const form_tab_map: { [key: string]: string } = {};

function App() {
  const [tabs, setTabs] = useState(DEMO_TABS);

  const addTab = async (formId: string) => {
    if (formId in form_tab_map) {
      const _tabId = form_tab_map[formId];
      const updatedTabs = tabs.map(tab => ({
        ...tab,
        status: tab.id === _tabId ? 'ACTIVE' : tab.status === 'CLOSE' ? 'CLOSE' : 'OPEN',
      }));
      setTabs(updatedTabs);
      return;
    }

    const newTabId = `tab${tabs.length + 1}`;
    form_tab_map[formId] = newTabId;
    let content;

    if (formId === 'NewPartyMaster') {
      content = <EntryForm formId={newTabId} />;
    } else if (formId.startsWith('PartyCategoryMaster')) {
      content = <PartyCategoryMaster formId={newTabId} />;
    } else if (formId.startsWith('PartyTypeMaster')) {
      content = <PartyTypeMaster formId={newTabId} />;
    } 
    // else if (formId.startsWith('UserManagement')) {
    //   content=<UserEntryList  userConfig={userConfig} />
    // }
    else if(formId.startsWith('RoleManagement')){

      try {
        const list_config=await fetch("http://localhost:5000/list_config");
        const list_config_data=await list_config.json();

        content = <RoleEntryList list_config={list_config_data} />

      } catch (error) {
        console.log(error);
        
      }
    }
    else if(formId.startsWith('NewItemMaster')){
      content = <ItemMaster formId={newTabId} />;

    } else if (formId.startsWith('ItemBrandMaster')) {
      content = <ItemBrandMaster formId={newTabId} />;
    } else if (formId.startsWith('ItemCategoryMaster')) {
      content = <ItemCategoryMaster formId={newTabId} />;
    } else if (formId.startsWith('Country')) {
      content = <CountryMaster formId={newTabId} />;
    } else if (formId.startsWith('State')) {
      content = <StateMaster formId={newTabId} />;
    } else if (formId.startsWith('District')) {
      content = <DistrictMaster formId={newTabId} />;
    } else if (formId.startsWith('City')) {
      content = <CityMaster formId={newTabId} />;
    } else {
      content = <div>Unknown formId</div>;
    }

    const newTab: Tab = {
      id: newTabId,
      title: `${formId}`,
      content: content,
      status: "ACTIVE"
    };

    const activeTabIndex = tabs.findIndex(tab => tab.status === "ACTIVE");
    if (activeTabIndex !== -1) {
      const updatedTabs = [...tabs];
      updatedTabs[activeTabIndex] = { ...updatedTabs[activeTabIndex], status: "OPEN" };
      setTabs([...updatedTabs, { ...newTab, status: "ACTIVE" }]);
    } else {
      setTabs([...tabs, { ...newTab, status: "ACTIVE" }]);
    }
  };

  return (
    <div className={styles.app}>
      
      <Header title="React Components Demo" addTab={addTab} />
      <main className={styles.content}>
          <TabContainer tabs={tabs} onTabsUpdate={setTabs} />
      </main>
    </div>
  );
}

export default App;



