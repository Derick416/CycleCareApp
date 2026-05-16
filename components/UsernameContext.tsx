import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadAccounts, saveAccounts, writeLastLogin, StoredAccount } from './AccountStorage';

type UsernameContextType = {
  username: string;
  loading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const UsernameContext = createContext<UsernameContextType>({
  username: '',
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const store = await loadAccounts();
      if (store.lastLogin) {
        const account = store.accounts.find((item) => item.username === store.lastLogin);
        if (account) {
          setUsername(account.username);
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (inputUsername: string, password: string, rememberMe: boolean) => {
    const store = await loadAccounts();
    const account = store.accounts.find((item) => item.username === inputUsername);
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.password !== password) {
      throw new Error('Invalid password');
    }
    setUsername(account.username);
    if (rememberMe) {
      await writeLastLogin(account.username);
    }
  };

  const register = async (inputUsername: string, password: string) => {
    const store = await loadAccounts();
    const exists = store.accounts.some((item) => item.username === inputUsername);
    if (exists) {
      throw new Error('Username already exists');
    }
    const newAccount: StoredAccount = {
      username: inputUsername,
      password,
      entries: [],
      createdAt: new Date().toISOString(),
    };
    await saveAccounts({ ...store, accounts: [newAccount, ...store.accounts], lastLogin: inputUsername });
    setUsername(inputUsername);
  };

  const logout = async () => {
    setUsername('');
    await writeLastLogin(undefined);
  };

  return (
    <UsernameContext.Provider value={{ username, loading, login, register, logout }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  return useContext(UsernameContext);
}
