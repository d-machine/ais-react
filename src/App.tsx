import Header from './components/header/Header';
import styles from './App.module.css';
import TabContainer from './components/tabs/TabContainer';
import useTabsStore from './useTabsStore';

function App() {
  const { tabs } = useTabsStore();

  return (
    <div className={styles.app}>
      <Header title="React Components Demo" />
      <main className={styles.content}>
        <TabContainer tabs={tabs} />
      </main>
    </div>
  );
}

export default App;
