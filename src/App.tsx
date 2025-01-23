import { useState } from "react";
import Header from "./components/header/Header";
import { Tab } from "./components/tabs/types";
import styles from "./App.module.css";
import TabContainer from "./components/tabs/TabContainer";
import EntryList from "./components/Users/EntryList";
import accessToken from "../accesstoken";
import axios from "axios";

const DEMO_TABS: Tab[] = [];

const form_tab_map: { [key: string]: string } = {};

function App() {
  const [tabs, setTabs] = useState(DEMO_TABS);

  const addTab = async (formId: string, list_config_file: string) => {
    if (formId in form_tab_map) {
      const _tabId = form_tab_map[formId];
      const updatedTabs = tabs.map((tab) => ({
        ...tab,
        status: tab.id === _tabId ? "ACTIVE" : tab.status === "CLOSE" ? "CLOSE" : "OPEN",
      }));
      setTabs(updatedTabs);
      return;
    }

    const newTabId = `tab${tabs.length + 1}`;
    form_tab_map[formId] = newTabId;
    let content;
    if (formId === "6" || formId === "7") {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/generic/getConfig",
          {
            configFile: list_config_file,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        content = <EntryList list_config={response.data} list={list_config_file} />;
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    } else {
      content = <div>Unknown formId</div>;
    }

    const newTab: Tab = {
      id: newTabId,
      title: `${formId}`,
      content: content,
      status: "ACTIVE",
    };

    const activeTabIndex = tabs.findIndex((tab) => tab.status === "ACTIVE");
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
