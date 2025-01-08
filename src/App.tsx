import  { useState } from 'react';
import Header from './components/header/Header';
import TabContainer from './components/tabs/TabContainer';
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
import EntryList from './Utilities/EntryList';
import { useStore } from './store';
import ItemMaster from './components/EntryForm/ItemMaster';
import Modal from './Utilities/Modal';

const DEMO_TABS: Tab[] = [
];

const form_tab_map: { [key: string]: string } = {};

function App() {
  const [tabs, setTabs] = useState(DEMO_TABS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const fetchData = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const addTab = async (formId: string) => {
    setIsModalOpen(false);
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
    } else if (formId.startsWith('ItemMaster')) {
      try {
        const entries = await fetchData('http://localhost:5000/itemmaster');
        console.log(entries, "data");
        content = (
          <EntryList
          setModalContent={setModalContent}
          setisopen={setIsModalOpen}
            entries={entries}
          />
        );
      } catch (error) {
        console.error('Error fetching item master data:', error);
        content = <div>Error loading data</div>;
      }
    }else if(formId.startsWith('NewItemMaster')){
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
        {isModalOpen ? (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>{modalContent}</Modal>

        ) : (
          <TabContainer tabs={tabs} onTabsUpdate={setTabs} />
        )}
      </main>
      <button onClick={()=>useStore.getState()}>show store</button>
    </div>
  );
}

export default App;