import { useState } from 'react';
import styles from './Login.module.css';
import { loginApiCall } from '@api/base';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await loginApiCall(username, password);
    } catch (error) {
      console.log(error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.loginInputGroup}>
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
          <div className={styles.loginInputGroup}>
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
      </div>
    </div>
  )
}

export default Login;
