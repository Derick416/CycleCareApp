import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    DEFAULT_NOTIFICATION_PREFERENCES,
    loadAccounts,
    saveAccounts,
    StoredAccount,
    writeLastLogin,
} from './AccountStorage';

type UsernameContextType = {
  username: string;
  email?: string;
  loading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const UsernameContext = createContext<UsernameContextType>({
  username: '',
  email: undefined,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      // Load accounts to ensure storage is accessible, but do not auto-login here.
      // We keep `lastLogin` saved so the Login screen can offer saved-account selection,
      // but the app should always navigate to the login screen after the splash.
      await loadAccounts();
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (inputUsername: string, password: string, rememberMe: boolean) => {
    const store = await loadAccounts();
    const account = store.accounts.find((item) => item.username === inputUsername);
    if (account) {
      if (account.password !== password) {
        throw new Error('Invalid password');
      }
      setUsername(account.username);
      setEmail(account.email);
      if (rememberMe) {
        await writeLastLogin(account.username);
      }
    } else {
      const newAccount: StoredAccount = {
        username: inputUsername,
        password,
        email: undefined,
        entries: [],
        createdAt: new Date().toISOString(),
        notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
      };
      await saveAccounts({ ...store, accounts: [newAccount, ...store.accounts] });
      setUsername(inputUsername);
      setEmail(undefined);
      if (rememberMe) {
        await writeLastLogin(inputUsername);
      }
    }
  };

  const register = async (inputUsername: string, password: string, email?: string) => {
    const store = await loadAccounts();
    const exists = store.accounts.some((item) => item.username === inputUsername);
    if (exists) {
      throw new Error('Username already exists');
    }
    const newAccount: StoredAccount = {
      username: inputUsername,
      password,
      email: email?.trim() || undefined,
      entries: [],
      createdAt: new Date().toISOString(),
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
    };
    await saveAccounts({ ...store, accounts: [newAccount, ...store.accounts], lastLogin: inputUsername });
    setUsername(inputUsername);
    setEmail(email?.trim() || undefined);
  };

  const logout = async () => {
    setEmail(undefined);
    setUsername('');
    await writeLastLogin(undefined);
  };

  return (
    <UsernameContext.Provider value={{ username, email, loading, login, register, logout }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  return useContext(UsernameContext);
}
