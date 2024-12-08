import Header from './components/header/Header';
import TabContainer from './components/tabs/TabContainer';
import { Tab } from './components/tabs/types';
import styles from './App.module.css';
import EntryForm from './components/EntryForm/EntryForm';

const DEMO_TABS: Tab[] = [
  {
    id: 'tab1',
    title: 'Entry Form',
    content: <EntryForm />
  },
  {
    id: 'tab2',
    title: 'Second Tab',
    content: <div>Content for the second tab goes here</div>
  },
  {
    id: 'tab3',
    title: 'Third Tab',
    content: <div>Third tab content is displayed here</div>
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
