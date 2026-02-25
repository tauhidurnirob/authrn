import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = '@mock_users';
let users: Array<User & { password: string }> = [];

export const loadUsers = async () => {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    users = raw ? JSON.parse(raw) : [];
  } catch {
    users = [];
  }
};

const saveUsers = async () => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
};

export const findUserByEmail = (email: string) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const addUser = async (name: string, email: string, password: string) => {
  const id = Math.random().toString(36).slice(2, 9);
  const user: User & { password: string } = { id, name, email, password };
  users.push(user);
  await saveUsers();
  return user;
};
