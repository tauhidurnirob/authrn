import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUsers, findUserByEmail, addUser } from './mockDb';

const USERS_KEY = '@mock_users';

beforeEach(async () => {
  await AsyncStorage.clear();
  await loadUsers();
});

describe('loadUsers', () => {
  it('starts empty when storage is empty', () => {
    expect(findUserByEmail('any@example.com')).toBeNull();
  });

  it('populates from persisted storage', async () => {
    const stored = [{ id: '1', name: 'Alice', email: 'alice@test.com', password: 'pass123' }];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(stored));
    await loadUsers();
    expect(findUserByEmail('alice@test.com')).not.toBeNull();
  });

  it('handles corrupt JSON silently and leaves list empty', async () => {
    await AsyncStorage.setItem(USERS_KEY, 'not-valid-json');
    await expect(loadUsers()).resolves.not.toThrow();
    expect(findUserByEmail('any@example.com')).toBeNull();
  });
});

describe('findUserByEmail', () => {
  it('returns null when no users exist', () => {
    expect(findUserByEmail('nobody@test.com')).toBeNull();
  });

  it('finds a user', async () => {
    await addUser('Bob', 'bob@test.com', 'pass123');
    expect(findUserByEmail('bob@test.com')).not.toBeNull();
  });

  it('is case-insensitive', async () => {
    await addUser('Bob', 'BOB@TEST.COM', 'pass123');
    expect(findUserByEmail('bob@test.com')).not.toBeNull();
    expect(findUserByEmail('BOB@TEST.COM')).not.toBeNull();
  });

  it('returns null for an unknown email', async () => {
    await addUser('Bob', 'bob@test.com', 'pass123');
    expect(findUserByEmail('other@test.com')).toBeNull();
  });
});

describe('addUser', () => {
  it('returns the created user with correct fields', async () => {
    const user = await addUser('Alice', 'alice@test.com', 'pass123');
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect(user.password).toBe('pass123');
    expect(user.id).toBeTruthy();
  });

  it('makes the user findable immediately', async () => {
    await addUser('Alice', 'alice@test.com', 'pass123');
    expect(findUserByEmail('alice@test.com')).not.toBeNull();
  });

  it('persists the user to AsyncStorage', async () => {
    await addUser('Alice', 'alice@test.com', 'pass123');
    const raw = await AsyncStorage.getItem(USERS_KEY);
    const saved = JSON.parse(raw!);
    expect(saved).toHaveLength(1);
    expect(saved[0].email).toBe('alice@test.com');
  });

  it('generates unique ids for different users', async () => {
    const a = await addUser('A', 'a@test.com', 'pass123');
    const b = await addUser('B', 'b@test.com', 'pass123');
    expect(a.id).not.toBe(b.id);
  });
});
