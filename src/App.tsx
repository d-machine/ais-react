import Header from './header/Header';
import TabContainer from './tabs/TabContainer';
import { Tab } from './tabs/types';
import styles from './App.module.css';

const DEMO_TABS: Tab[] = [
  {
    id: 'tab1',
    title: 'First Tab',
    content: 'This is the content of the first tab'
  },
  {
    id: 'tab2',
    title: 'Second Tab',
    content: 'Content for the second tab goes here'
  },
  {
    id: 'tab3',
    title: 'Third Tab',
    content: 'Third tab content is displayed here'
  }
];

function App() {
  return (
    <div className={styles.app}>
      <Header title="React Components Demo" />
      <main className={styles.content}>
        <TabContainer tabs={DEMO_TABS} />
      </main>
    </div>
  );
}

export default App;
