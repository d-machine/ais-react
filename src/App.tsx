import Header from './components/header/Header';
import TabContainer from './components/tabs/TabContainer';
import { Tab } from './components/tabs/types';
import styles from './App.module.css';
import EntryForm from './components/EntryForm/EntryForm';
import { useState } from 'react';

const DEMO_TABS: Tab[] = [
  {
    id: 'tab1',
    title: 'Entry Form',
    content: <EntryForm formId={"tab1"}/>,
    status:"ACTIVE"
  }
];

function App() {

  const [tabs, setTabs] = useState(DEMO_TABS);

  const addTab = (formId:string,form_tab_map:{[key:string]:string}) => {
    if(formId in form_tab_map){
      const _tabId = form_tab_map[formId];
      const updatedTabs = tabs.map(tab => ({
        ...tab,
        status: tab.id === _tabId ? 'ACTIVE' :tab.status === 'CLOSE' ? 'CLOSE' : 'OPEN',
      }));
      setTabs(updatedTabs);
      return;
    }
    const newTabId = `tab${tabs.length + 1}`; 
    form_tab_map[formId]=newTabId;
    const newTab: Tab = {
      id: newTabId,
      title: `New Tab ${tabs.length + 1}`,
      content: <EntryForm formId={newTabId}/>,
      status:"ACTIVE"
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
        <TabContainer tabs={tabs} onTabsUpdate={setTabs}/>
      </main>
    </div>
  );
}

export default App;
