import Header from './components/header/Header';
import styles from './App.module.css';
import TabContainer from './components/tabs/TabContainer';
function App() {
  return (
    <div className={styles.app}>
      <Header title="React Components Demo" />
      <main className={styles.content}>
        <TabContainer/>
      </main>
    </div>
  );
}

export default App;
