
import { useEffect, useState } from 'react';
import Header from '@components/impure/header';
import TabContainer from '@components/tabs/TabContainer';

import styles from '@styles/App.module.css';

import { refreshTokenApiCall } from '@api/base';
import useAuthStore from '@/stores/auth/store';
import Login from './components/impure/login';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      if (isLoggedIn) {
        setAuthInitialized(true);
        return;
      }
      if (refreshToken) {
        const success = await refreshTokenApiCall(refreshToken);
        if (success) {
          setAuthInitialized(true);
          return;
        }
        useAuthStore.setState({ isLoggedIn: false, refreshToken: undefined });
      }
      setAuthInitialized(true);
    }
    initializeAuth();
  }, [isLoggedIn, refreshToken]);

  if (!authInitialized && refreshToken) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {
        !isLoggedIn ? (<Login />) :
          (
            <>
              <header className={styles.header}>
                <Header title="Galaxy Distributions" />
              </header>
              <main className={styles.content}>
                <TabContainer />
              </main>
            </>
          )
      }

    </div>
  );
}

export default App;
