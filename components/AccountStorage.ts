import * as FileSystem from 'expo-file-system';
import { CycleEntry } from './CycleContext';

export type StoredAccount = {
  username: string;
  password: string;
  entries: CycleEntry[];
  createdAt: string;
};

export type StoredAccounts = {
  accounts: StoredAccount[];
  lastLogin?: string;
};

const ACCOUNTS_FILE = `${FileSystem.documentDirectory}accounts.json`;

const defaultStore: StoredAccounts = {
  accounts: [],
};

export async function loadAccounts(): Promise<StoredAccounts> {
  try {
    const info = await FileSystem.getInfoAsync(ACCOUNTS_FILE);
    if (!info.exists) return defaultStore;
    const json = await FileSystem.readAsStringAsync(ACCOUNTS_FILE);
    return JSON.parse(json) as StoredAccounts;
  } catch {
    return defaultStore;
  }
}

export async function saveAccounts(data: StoredAccounts): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(ACCOUNTS_FILE, JSON.stringify(data));
  } catch (error) {
    console.warn('Unable to save accounts', error);
  }
}

export async function findAccount(username: string): Promise<StoredAccount | undefined> {
  const store = await loadAccounts();
  return store.accounts.find((account) => account.username === username);
}

export async function updateAccount(account: StoredAccount): Promise<void> {
  const store = await loadAccounts();
  const accounts = store.accounts.filter((item) => item.username !== account.username);
  accounts.unshift(account);
  await saveAccounts({ ...store, accounts });
}

export async function writeLastLogin(username: string | undefined): Promise<void> {
  const store = await loadAccounts();
  await saveAccounts({ ...store, lastLogin: username });
}
