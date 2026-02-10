import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@seniorprotect:favorites';

export async function getFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const current = await getFavorites();
  const next = current.includes(id)
    ? current.filter((fav) => fav !== id)
    : [...current, id];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
