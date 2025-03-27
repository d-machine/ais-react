import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/header/Header';
import TabContainer from './components/tabs/TabContainer';
import styles from './App.module.css';
import { loginApiCall, logoutApiCall, refreshTokenApiCall } from './api/base';
import useAuthStore from './store/auth/store';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC<{
  onSubmit: (data: LoginFormData) => Promise<void>;
  errorMessage: string | null;
}> = ({ onSubmit, errorMessage }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>
        <button className={styles.loginButton} type="submit">Login</button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className={styles.loading}>
    <div className={styles.spinner} />
    <p>Loading...</p>
  </div>
);

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeAuth = useCallback(async () => {
    if (isLoggedIn) {
      setAuthInitialized(true);
      return;
    }

    if (refreshToken) {
      try {
        setIsLoading(true);
        const success = await refreshTokenApiCall(refreshToken);
        if (success) {
          setAuthInitialized(true);
          return;
        }
        useAuthStore.setState({ isLoggedIn: false, refreshToken: undefined });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to refresh token');
        setErrorMessage(err.message);
        useAuthStore.setState({ isLoggedIn: false, refreshToken: undefined });
      } finally {
        setIsLoading(false);
      }
    }
    setAuthInitialized(true);
  }, [isLoggedIn, refreshToken]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogin = useCallback(async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await loginApiCall(data.username, data.password);
      setAuthInitialized(true);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Login failed');
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logoutApiCall();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Logout failed');
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!authInitialized && refreshToken) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.app}>
      {!isLoggedIn ? (
        <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />
      ) : (
        <>
          <Header title="React Components Demo">
            <button 
              className={styles.logoutButton} 
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </Header>
          <main className={styles.content}>
            <TabContainer />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
