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
import UserEntryList from './components/Users/UserEntryList';
import Modal from './Utilities/Modal';
import RoleEntryList from './components/Users/RoleEntryList';

const DEMO_TABS: Tab[] = [
];

const form_tab_map: { [key: string]: string } = {};

function App() {
  const [tabs, setTabs] = useState(DEMO_TABS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

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
    } else if (formId.startsWith('UserManagement')) {
      content=<UserEntryList setModalContent={setModalContent}
      setisopen={setIsModalOpen} userConfig={userConfig} />
    }else if(formId.startsWith('RoleManagement')){
      content = <RoleEntryList setModalContent={setModalContent}
      setisopen={setIsModalOpen} userConfig={roleConfig} />
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
      {isModalOpen ? (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>{modalContent}</Modal>

        ) : (
          <TabContainer tabs={tabs} onTabsUpdate={setTabs} />
        )}
      </main>
    </div>
  );
}

export default App;


const userConfig = {
  applyAccessLevelRestrictions: false,
  onLoad: "users",
  onLoadParams: ["resource_id", "list"],
  queryFile: "list-query",
  pagenation: true,
  filterable: true,
  sortable: true,
  applicableActions: ["add", "edit", "changePassword", "delete"],
  actionConfig: {
    add: {
      label: "Add New User",
      onPress: "displayForm",
      "form-config": "add",
      onComplete: "refresh",
    },
    edit: {
      label: "Edit User",
      onPress: "dispayForm",
      onPressParams: ["user_id"],
      "form-config": "edit",
      onComplete: "refresh",
    },
    changePassword: {
      label: "Change Password",
      onPress: "displayForm",
      onPressParams: ["user_id"],
      "form-config": "change-password",
      onComplete: "refresh",
    },
    delete: {
      label: "Delete User",
      onPress: "executeQuery",
      query: "CALL delete_user($1, $2)",
      onPressParams: ["user_id"],
      "context-params": ["current_user_id"],
      onComplete: "refresh",
    },
  },
  columns: [
    {
      name: "username",
      label: "Username",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "email",
      label: "Email",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "full_name",
      label: "Full Name",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "reports_to",
      label: "Reports To",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "roles",
      label: "Roles",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "last_updated_by",
      label: "Last Updated By",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "last_updated_at",
      label: "Last Updated At",
      width: 200,
      sortable: true,
      filterType: "string",
    },
  ],
};


const roleConfig={
  "applyAccessLevelRestrictions": false,
  "onLoad": "roles",
  "onLoadParams": [],
  "queryFile": "list-role",
  "pagenation": true,
  "filterable": true,
  "sortable": true,
  "applicableActions": ["add", "edit", "delete"],
  "actionConfig": {
    "add": {
        "label": "Add New Role",
        "onPress": "displayForm",
        "formConfig": "add-role",
        "onComplete": "refresh"
    }, 
    "edit": {
        "label": "Edit Role",
        "onPress": "displayForm",
        "payload": ["role_id"],
        "formConfig": "edit-role",
        "onComplete": "refresh"
    },
    "delete": {
        "label": "Delete Role",
        "onPress": "executeQuery",
        "query": "CALL delete_role($1)",
        "payload": ["role_id"],
        "onComplete": "refresh"
    }
  },
  "columns": [
    {
      "name": "name",
      "label": "Role Name",
      "width": 200,
      "sortable": true,
      "filterType": "string"
    },
    {
      "name": "description",
      "label": "Description",
      "width": 500,
      "sortable": true,
      "filterType": "string"
    }
  ]
}
