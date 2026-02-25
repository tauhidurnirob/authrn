import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../utils/mockDb', () => ({
  loadUsers: jest.fn().mockResolvedValue(undefined),
  findUserByEmail: jest.fn(),
  addUser: jest.fn(),
}));

import { loadUsers, findUserByEmail, addUser } from '../utils/mockDb';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  (loadUsers as jest.Mock).mockResolvedValue(undefined);
  jest.useRealTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// Flush all pending micro-tasks and the session-restore useEffect.
const waitForRestore = () => act(async () => {});

// ─── Session restore ──────────────────────────────────────────────────────────

describe('session restore', () => {
  it('restores persisted user on mount', async () => {
    const stored = { id: '1', name: 'Alice', email: 'alice@test.com' };
    await AsyncStorage.setItem('@auth_user', JSON.stringify(stored));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForRestore();

    expect(result.current.user).toEqual(stored);
    expect(result.current.isRestoring).toBe(false);
  });

  it('stays logged out when storage is empty', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForRestore();

    expect(result.current.user).toBeNull();
    expect(result.current.isRestoring).toBe(false);
  });

  it('stays logged out if stored data is corrupt', async () => {
    await AsyncStorage.setItem('@auth_user', 'not-valid-json');

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitForRestore();

    expect(result.current.user).toBeNull();
    expect(result.current.isRestoring).toBe(false);
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

// login() has a 400ms fake-latency setTimeout. Use fake timers so tests
// complete instantly and the timer never fires after the hook unmounts.

describe('login', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  /** Start fn(), then advance all fake timers so the 400ms delay resolves. */
  const runWithTimers = async (fn: () => Promise<unknown>) => {
    const p = fn();
    await act(async () => { jest.runAllTimers(); });
    return p;
  };

  it('sets user on correct credentials', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Alice', email: 'alice@test.com', password: 'pass123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); }); // flush restore effect

    await act(async () => {
      await runWithTimers(() => result.current.login('alice@test.com', 'pass123'));
    });

    expect(result.current.user?.email).toBe('alice@test.com');
    expect(result.current.user?.name).toBe('Alice');
  });

  it('persists session to AsyncStorage on success', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Alice', email: 'alice@test.com', password: 'pass123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await act(async () => {
      await runWithTimers(() => result.current.login('alice@test.com', 'pass123'));
    });

    const stored = await AsyncStorage.getItem('@auth_user');
    expect(JSON.parse(stored!).email).toBe('alice@test.com');
  });

  it('throws on invalid email format', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => { await result.current.login('bad-email', 'pass123'); }),
    ).rejects.toThrow('Invalid email format');
    expect(result.current.user).toBeNull();
  });

  it('throws on password shorter than 6 characters', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => { await result.current.login('a@b.com', 'abc'); }),
    ).rejects.toThrow('Password must be at least 6 characters');
  });

  it('throws when user is not found', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => {
        await runWithTimers(() => result.current.login('nobody@test.com', 'pass123'));
      }),
    ).rejects.toThrow('Incorrect email or password');
  });

  it('throws on wrong password', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Alice', email: 'alice@test.com', password: 'correct1',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => {
        await runWithTimers(() => result.current.login('alice@test.com', 'wrong123'));
      }),
    ).rejects.toThrow('Incorrect email or password');
  });

  it('resets isLoading to false after success', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Alice', email: 'alice@test.com', password: 'pass123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await act(async () => {
      await runWithTimers(() => result.current.login('alice@test.com', 'pass123'));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('resets isLoading to false after failure', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await act(async () => {
      await runWithTimers(() =>
        result.current.login('a@b.com', 'pass123').catch(() => {}),
      );
    });

    expect(result.current.isLoading).toBe(false);
  });
});

// ─── signup ───────────────────────────────────────────────────────────────────

describe('signup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  const runWithTimers = async (fn: () => Promise<unknown>) => {
    const p = fn();
    await act(async () => { jest.runAllTimers(); });
    return p;
  };

  it('creates user and sets them as current user', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue(null);
    (addUser as jest.Mock).mockResolvedValue({
      id: '2', name: 'Bob', email: 'bob@test.com', password: 'pass123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await act(async () => {
      await runWithTimers(() => result.current.signup('Bob', 'bob@test.com', 'pass123'));
    });

    expect(result.current.user?.email).toBe('bob@test.com');
  });

  it('throws when name is empty', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => { await result.current.signup('', 'bob@test.com', 'pass123'); }),
    ).rejects.toThrow('Name is required');
  });

  it('throws on invalid email format', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => { await result.current.signup('Bob', 'bad-email', 'pass123'); }),
    ).rejects.toThrow('Invalid email format');
  });

  it('throws on short password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => { await result.current.signup('Bob', 'bob@test.com', 'abc'); }),
    ).rejects.toThrow('Password must be at least 6 characters');
  });

  it('throws when email is already in use', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Existing', email: 'used@test.com', password: 'x',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await expect(
      act(async () => {
        await runWithTimers(() => result.current.signup('Bob', 'used@test.com', 'pass123'));
      }),
    ).rejects.toThrow('Email already in use');
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe('logout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  const runWithTimers = async (fn: () => Promise<unknown>) => {
    const p = fn();
    await act(async () => { jest.runAllTimers(); });
    return p;
  };

  it('clears current user', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Alice', email: 'alice@test.com', password: 'pass123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await act(async () => {
      await runWithTimers(() => result.current.login('alice@test.com', 'pass123'));
    });
    await act(async () => { await result.current.logout(); });

    expect(result.current.user).toBeNull();
  });

  it('removes session from AsyncStorage', async () => {
    (findUserByEmail as jest.Mock).mockReturnValue({
      id: '1', name: 'Alice', email: 'alice@test.com', password: 'pass123',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => { jest.runAllTimers(); });

    await act(async () => {
      await runWithTimers(() => result.current.login('alice@test.com', 'pass123'));
    });
    await act(async () => { await result.current.logout(); });

    expect(await AsyncStorage.getItem('@auth_user')).toBeNull();
  });
});
