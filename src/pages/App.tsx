
import React, { useEffect, useState } from 'react';
import Header from '@components/Header';
import TabContainer from '@components/tabs/TabContainer';

import styles from '@styles/App.module.css';

import { loginApiCall, logoutApiCall, refreshTokenApiCall } from '@api/base';
import useAuthStore from '@api/auth/store';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authInitialized, setAuthInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await loginApiCall(username, password);
      setAuthInitialized(true);
    } catch (error) {
      console.log(error);
      
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    logoutApiCall();
  };

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
          !isLoggedIn?( <div className={styles.loginContainer}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className={styles.loginButton} type="submit">Login</button>
              {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </form>
          </div>):
          (
          <>
        <Header title="React Components Demo">
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </Header>
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
