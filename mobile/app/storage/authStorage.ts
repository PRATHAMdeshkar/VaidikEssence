import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  token: 'auth_token',
  user: 'auth_user',
} as const;

export interface StoredUser {
  email: string;
  phone: string;
  name: string;
}

export async function saveAuthData(token: string, user: StoredUser): Promise<void> {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.token, token],
    [STORAGE_KEYS.user, JSON.stringify(user)],
  ]);

  const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.token);
  console.log('Saved JWT token:', savedToken);
}

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.token);
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const user = await AsyncStorage.getItem(STORAGE_KEYS.user);
  return user ? JSON.parse(user) : null;
}

export async function clearAuthData(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.user]);
}

export { STORAGE_KEYS };
