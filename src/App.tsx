
import { useEffect, useState } from 'react';
import Header from '@components/impure/header';
import TabContainer from '@components/tabs/TabContainer';

import styles from '@styles/App.module.css';

import { refreshTokenApiCall } from '@api/base';
import Login from './components/impure/login';
import { getBoolean, getString } from './storage/base';
import { IS_LOGGED_IN, REFRESH_TOKEN } from './storage/contants';
import { logOut } from './storage/auth';
import { AUTH_CHANGED } from './events/constants';
import { bcm } from './events/base';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(getBoolean(IS_LOGGED_IN));

  useEffect(() => {
    if (isLoggedIn === null) {
      refreshTokenApiCall();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handler = () => {
      // console.log("AUTH_CHANGED event received");
      const loggedIn = getBoolean(IS_LOGGED_IN);
      const refreshToken = getString(REFRESH_TOKEN);
      if (loggedIn && !refreshToken) {
        logOut();
        return;
      }
      setIsLoggedIn(loggedIn);
    };
    console.log("Registering AUTH_CHANGED event handler");
    bcm.register(AUTH_CHANGED, handler);
    return () => {
      bcm.deregister(AUTH_CHANGED, handler);
    };
  }, []);

  if (isLoggedIn === null) {
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
