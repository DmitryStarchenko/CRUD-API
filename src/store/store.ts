import type { IStore } from '../types/types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const STORE_PATH = join(process.cwd(), 'src/store/store-data.json');

export const readStore = async (): Promise<IStore[]> => {
  try {
    const data = await readFile(STORE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const writeStore = async (data: IStore[]) => {
  await writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

export let store: IStore[] = [];

readStore().then((data) => {
  store = data;
});

export const getStore = async (): Promise<IStore[]> => {
  store = await readStore();
  return store;
};

export const addUser = async (item: IStore) => {
  const currentStore = await getStore();
  currentStore.push(item);
  await updateUser(currentStore);
};

export const updateUser = async (newStore: IStore[]) => {
  store = newStore;
  await writeStore(store);
};

export const removeUser = async (id: string) => {
  const currentStore = await getStore();
  const updatedStore = currentStore.filter((item) => item.id !== id);
  await updateUser(updatedStore);
};

export const getUser = async (id: string): Promise<IStore | undefined> => {
  const currentStore = await getStore();
  return currentStore.find((item) => item.id === id);
};
